interface Env {
  OPENROUTER_API_KEY?: string;
}

interface PagesContext {
  request: Request;
  env: Env;
}

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const onRequest = async (context: PagesContext): Promise<Response> => {
  const { request, env } = context;

  // 1. Only allow POST requests
  if (request.method !== "POST") {
    return new Response("Method Not Allowed", { status: 405 });
  }

  // 2. Get the API key from Cloudflare Pages environment variables
  const apiKey = env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Server configuration error: OPENROUTER_API_KEY missing." },
      { status: 500 }
    );
  }

  try {
    const body = await request.text();
    const origin = new URL(request.url).origin;

    // 3. Forward the request to OpenRouter
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": request.headers.get("referer") || origin,
        "X-Title": "Fleet Dispatch System (Secure Proxy)",
      },
      body,
    });

    const data = await response.text();

    return new Response(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Proxy Error:", error);
    return Response.json(
      { error: "Failed to communicate with AI service." },
      { status: 500 }
    );
  }
};
