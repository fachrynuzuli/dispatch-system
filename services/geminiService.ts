import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Inspection, Truck, DispatchRequest, DispatchAssignment, Driver } from "../types";

const apiKey = process.env.GEMINI_API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

/**
 * Helper to safely get text from response
 */
const getText = (response: GenerateContentResponse): string => {
  return response.text || "No analysis available.";
};

/**
 * Analyzes inspection results to suggest a decision (Workshop vs Dispatch).
 */
export const analyzeInspection = async (inspection: Inspection, truck: Truck): Promise<string> => {
  if (!apiKey) return "API Key missing. Unable to perform AI analysis.";

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return getText(response);
  } catch (error) {
    console.error("Gemini Error:", error);
    return "AI Analysis failed. Please review manually.";
  }
};

/**
 * Suggests the best truck AND driver for a dispatch request using structured JSON output.
 */
export const optimizeDispatch = async (requests: DispatchRequest[], trucks: Truck[], drivers: Driver[]): Promise<DispatchAssignment[]> => {
  if (!apiKey) {
    console.error("API Key missing");
    return [];
  }

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

    Output a JSON array of assignments.
    
    CRITICAL INSTRUCTION FOR "reasoning" FIELD:
    Provide a compact, point-by-point reasoning using Markdown bullet points.
    - Explain the specific "Why" for BOTH the truck and the driver.
    - Explicitly mention the load capacity vs weight match.
    - Mention historical performance or experience.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              requestId: { type: Type.STRING },
              truckId: { type: Type.STRING },
              driverId: { type: Type.STRING },
              reasoning: { type: Type.STRING },
              confidenceScore: { type: Type.NUMBER }
            },
            required: ['requestId', 'truckId', 'driverId', 'reasoning', 'confidenceScore']
          }
        }
      }
    });

    const jsonStr = response.text || '[]';
    return JSON.parse(jsonStr);
  } catch (error) {
    console.error("Gemini Optimization Error:", error);
    return [];
  }
};

/**
 * Predicts asset lifespan and maintenance needs.
 */
export const predictAssetLifespan = async (truck: Truck): Promise<string> => {
  if (!apiKey) return "API Key missing.";

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

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return getText(response);
  } catch (error) {
    return "Unable to generate prediction.";
  }
};

/**
 * General chat for fleet insights.
 */
export const askFleetAssistant = async (question: string, contextData: string): Promise<string> => {
  if (!apiKey) return "API Key missing.";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Context: ${contextData}\n\nUser Question: ${question}\n\nAnswer as a helpful fleet assistant. Use compact, point-by-point Markdown formatting for your reasoning and explanations.`,
    });
    return getText(response);
  } catch (error) {
    return "I'm having trouble connecting to the fleet database right now.";
  }
};