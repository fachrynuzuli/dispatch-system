import { Handler } from '@netlify/functions';

const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const handler: Handler = async (event) => {
  // 1. Get the API key from Netlify's environment variables (Server-side only)
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

  if (!OPENROUTER_API_KEY) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Server configuration error: API Key missing." }),
    };
  }

  // 2. Only allow POST requests
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    // 3. Forward the request to OpenRouter
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": event.headers.referer || "https://fleet-dispatch.netlify.app",
        "X-Title": "Fleet Dispatch System (Secure Proxy)",
      },
      body: event.body,
    });

    const data = await response.json();

    return {
      statusCode: response.status,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };
  } catch (error) {
    console.error("Proxy Error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to communicate with AI service." }),
    };
  }
};
