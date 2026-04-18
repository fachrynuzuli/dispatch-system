import { Inspection, Truck, DispatchRequest, DispatchAssignment, Driver, SparePart } from "../types";

const PROXY_URL = "/.netlify/functions/openrouter-proxy";

// ─── Model Routing Strategy ────────────────────────────────────────────────
const MODELS_PAID = [
  "deepseek/deepseek-v3.2",
  "google/gemini-2.5-flash-lite",
  "minimax/minimax-m2.5"
];

const MODELS_FREE = [
  "moonshotai/kimi-k2.5",
  "z-ai/glm-4.5-air:free",
  "google/gemma-4-31b-it:free",
  ...MODELS_PAID
];

const chatCompletion = async (
  prompt: string,
  options?: { jsonMode?: boolean; model?: string | string[]; timeout?: number }
): Promise<string> => {
  const modelList = Array.isArray(options?.model)
    ? options.model
    : [options?.model || MODELS_FREE[0]];

  const timeoutMs = options?.timeout || 4000; // Default 4s for general tasks

  for (const modelId of modelList) {
    const body: Record<string, any> = {
      model: modelId,
      messages: [{ role: "user", content: prompt }],
    };

    if (options?.jsonMode) {
      body.response_format = { type: "json_object" };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(PROXY_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.text();
        console.warn(`Model ${modelId} failed (${response.status}): ${err}. Trying next...`);
        continue;
      }

      const data = await response.json();
      
      // OpenRouter can return 200 with an error object (e.g. rate limit or model down)
      if (data.error) {
        console.warn(`Model ${modelId} returned error:`, data.error.message || data.error);
        continue;
      }

      return data.choices?.[0]?.message?.content || "No analysis available.";
    } catch (error: any) {
      if (error.name === "AbortError") {
        console.warn(`Model ${modelId} timed out after ${timeoutMs}ms. Trying next...`);
      } else {
        console.warn(`Model ${modelId} fetch error:`, error);
      }
      continue;
    }
  }

  return "AI service is currently unavailable. Please try again later.";
};

/**
 * Analyzes inspection results to suggest a decision (Workshop vs Dispatch).
 */
export const analyzeInspection = async (inspection: Inspection, truck: Truck): Promise<string> => {
  const prompt = `
    You are a Senior Fleet Manager AI. Analyze the following inspection report for Truck ${truck.plate} (${truck.model}).
    
    Truck Mileage: ${truck.mileage} km
    Truck Health Score: ${truck.healthScore}/100
    
    Inspection Items:
    ${inspection.items.map(i => `- ${i.category}: ${i.status} (${i.notes})`).join('\n')}
    
    Inspector Notes: "${inspection.overallNotes}"
    
    Task:
    Provide a compact, point-by-point reasoning using Markdown bullet points.
    - Summarize critical issues.
    - Recommend a decision ("Dispatch Ready" OR "Workshop Required").
    - Briefly explain the reasoning.
    
    Keep the tone professional and safety-first.
  `;

  // PAID — safety-critical decision (Workshop vs Dispatch). High patience (10s).
  return chatCompletion(prompt, { model: MODELS_PAID, timeout: 10000 });
};

/**
 * Suggests the best truck AND driver for a dispatch request using structured JSON output.
 */
export const optimizeDispatch = async (
  requests: DispatchRequest[],
  trucks: Truck[],
  drivers: Driver[]
): Promise<DispatchAssignment[]> => {

  const availableTrucks = trucks.filter(t => t.status === 'Available');
  const availableDrivers = drivers.filter(d => d.status === 'Available' && d.fatigueLevel !== 'High');
  const pendingRequests = requests.filter(r => r.status === 'Pending');

  if (availableTrucks.length === 0 || pendingRequests.length === 0 || availableDrivers.length === 0) return [];

  const contextData = `
    Vehicle Capabilities:
    - Heavy Haul (100t+): Volvo FH-16, Scania R620.
    - Medium-Heavy (50t-80t): Volvo FMX 500.
    - Standard (Up to 45t): Mercedes Axor.
    
    Driver Requirements:
    - Heavy Loads (>60t) require a Driver with >5 years experience AND 'Heavy Haul' certification.
    - Drivers with 'Medium' fatigue should not be assigned to critical/long-haul trips if possible.
    - High safety score (>85) preferred for high-value cargo.
    
    Dispatch Rules:
    - Safety First: Match Truck Capacity to Load Weight.
    - Match Driver skill to Truck Class.
  `;

  const prompt = `
    Act as a Chief Logistics Officer.
    Perform a 3-Way Match: Request <-> Truck <-> Driver.
    
    ${contextData}
    
    Available Trucks:
    ${availableTrucks.map(t => `- ID: ${t.id}, Model: ${t.model}, Health: ${t.healthScore}, Plate: ${t.plate}`).join('\n')}
    
    Available Drivers:
    ${availableDrivers.map(d => `- ID: ${d.id}, Name: ${d.name}, Exp: ${d.yearsExperience}yr, Safety: ${d.safetyScore}, Fatigue: ${d.fatigueLevel}, Certs: ${d.certifications.join(',')}`).join('\n')}
    
    Pending Requests:
    ${pendingRequests.map(r => `- ID: ${r.id}, Weight: ${r.cargoWeight}t, Dest: ${r.destination}`).join('\n')}

    Output a JSON array of assignments. Each object must have: requestId, truckId, driverId, reasoning (markdown bullet points), confidenceScore (0-1).
    
    CRITICAL INSTRUCTION FOR "reasoning" FIELD:
    Provide a compact, point-by-point reasoning using Markdown bullet points.
    - Explain the specific "Why" for BOTH the truck and the driver.
    - Explicitly mention the load capacity vs weight match.
    - Mention historical performance or experience.
    
    Return ONLY the JSON array, no other text.
  `;

  try {
    // PAID — structured JSON dispatch optimization requires high accuracy and patience (12s)
    // If the model returns invalid JSON, the loop in chatCompletion won't catch it, 
    // so we handle it here if we want to force a fallback, but the current chatCompletion 
    // is model-centric. For now, let's keep it simple but with high patience.
    const result = await chatCompletion(prompt, { 
      jsonMode: true, 
      model: MODELS_PAID, 
      timeout: 12000 
    });
    
    const parsed = JSON.parse(result);
    return Array.isArray(parsed) ? parsed : parsed.assignments || [];
  } catch (error) {
    console.error("Dispatch Optimization Parse Error:", error);
    // If JSON fails, we don't have an easy way to "continue" the loop from here 
    // without refactoring chatCompletion further. For now, returning empty array.
    return [];
  }
};

/**
 * Predicts asset lifespan and maintenance needs.
 */
export const predictAssetLifespan = async (truck: Truck): Promise<string> => {
  const prompt = `
    Analyze the lifespan of this truck:
    Model: ${truck.model}
    Current Mileage: ${truck.mileage} km
    Purchase Date: ${truck.purchaseDate}
    Current Health Score: ${truck.healthScore}/100
    
    Provide a strategic assessment using compact, point-by-point Markdown bullet points:
    - Estimated Remaining Useful Life (in years/km).
    - Key maintenance risks for this specific model at this mileage.
    - Replacement recommendation (Keep, Refurbish, or Plan Disposal).
  `;

  // PAID — proactive asset management via button click
  return chatCompletion(prompt, { model: MODELS_PAID, timeout: 10000 });
};

/**
 * General chat for fleet insights.
 */
export const askFleetAssistant = async (question: string, contextData: string): Promise<string> => {
  const prompt = `Context: ${contextData}\n\nUser Question: ${question}\n\nAnswer as a helpful fleet assistant. Use compact, point-by-point Markdown formatting for your reasoning and explanations.`;
  // FREE — general Q&A chat
  return chatCompletion(prompt, { model: MODELS_FREE });
};

/**
 * Predicts inventory ordering needs based on fleet health and current stock.
 */
export const analyzeInventoryNeeds = async (inventory: SparePart[], trucks: Truck[]): Promise<string> => {
  const lowStockItems = inventory.filter(p => p.stockLevel <= p.minimumStock);
  const poorHealthTrucks = trucks.filter(t => t.healthScore < 70);
  const criticalHeavyHaulers = trucks.filter(t => t.model.includes('FH-16') || t.model.includes('R620'));
  const poorHealthCriticalTrucks = criticalHeavyHaulers.filter(t => t.healthScore < 80);

  const prompt = `
    You are a Senior Fleet Maintenance & Procurement AI. Analyze the current spare parts inventory and fleet health to recommend predictive ordering.
    
    Current Low/Out of Stock Items:
    ${lowStockItems.map(i => `- ${i.name} (Stock: ${i.stockLevel}, Min: ${i.minimumStock})`).join('\n')}
    
    Fleet Context:
    - Total Trucks: ${trucks.length}
    - Trucks with Poor Health (<70): ${poorHealthTrucks.length}
    - Critical Heavy Haulers (Volvo FH-16, Scania R620): ${criticalHeavyHaulers.length} total, ${poorHealthCriticalTrucks.length} needing attention (Health < 80).
    
    Task:
    Provide a compact, point-by-point reasoning using Markdown bullet points.
    - Identify critical shortage risks based on the low stock items.
    - Suggest specific spare parts to order based on common failure points for the fleet's most critical trucks (Volvo FH-16, Scania R620) considering their heavy workload.
    - Correlate the predicted maintenance needs of the poor health trucks with specific inventory items (e.g., heavy duty brake pads, transmission fluids, hydraulics).
    - Recommend predictive orders (what to order, estimated quantities, and why).
    
    Keep the tone professional, proactive, and focused on preventing fleet downtime.
  `;

  // PAID — inventory logistics via button click
  return chatCompletion(prompt, { model: MODELS_PAID, timeout: 10000 });
};

/**
 * Analyzes incoming vessels and suggests port operations and dispatch readiness.
 */
export const analyzeVesselArrivals = async (vessels: any[], trucks: Truck[]): Promise<string> => {
  const arrivingVessels = vessels.filter((v: any) => v.status === 'Arriving' || v.status === 'In Transit');
  const dockedVessels = vessels.filter((v: any) => v.status === 'Docked' || v.status === 'Unloading');
  const availableHeavyTrucks = trucks.filter(t => t.status === 'Available' && (t.model.includes('FH-16') || t.model.includes('R620')));

  const prompt = `
    You are a Port Operations & Logistics AI. Analyze the incoming vessel traffic and fleet readiness.
    
    Vessels Arriving Soon:
    ${arrivingVessels.map((v: any) => `- ${v.name} (${v.type}), Cargo: ${v.cargoWeight}t of ${v.cargoType}, ETA: ${v.eta}`).join('\n')}
    
    Vessels Currently Docked/Unloading:
    ${dockedVessels.map((v: any) => `- ${v.name} (${v.type}), Cargo: ${v.cargoWeight}t of ${v.cargoType}`).join('\n')}
    
    Fleet Readiness:
    - Available Heavy Haul Trucks (130t-150t capacity): ${availableHeavyTrucks.length}
    
    Task:
    Provide a compact, point-by-point reasoning using Markdown bullet points.
    - Assess the immediate dispatch needs for the docked vessels.
    - Predict the truck allocation required for the arriving vessels based on their cargo weight.
    - Identify any potential bottlenecks (e.g., not enough heavy haulers for the incoming cargo).
    - Provide actionable recommendations for the dispatch team to prepare for the incoming load.
    
    Keep the tone professional, proactive, and focused on seamless port-to-truck logistics.
  `;

  // PAID — port operations summary via button click
  return chatCompletion(prompt, { model: MODELS_PAID, timeout: 10000 });
};
