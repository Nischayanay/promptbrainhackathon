import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";

const app = new Hono();

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Simple test endpoint
app.get("/test", (c) => {
  return c.json({ message: "Function is working!", timestamp: new Date().toISOString() });
});

// Enhanced prompt endpoint - simplified version
app.post("/enhance-prompt", async (c) => {
  try {
    const body = await c.req.json();
    const { mode, originalPrompt } = body;

    console.log(`Received request: mode=${mode}, prompt="${originalPrompt}"`);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    console.log(`Gemini API key found: ${geminiApiKey ? 'YES' : 'NO'}`);

    if (!geminiApiKey) {
      console.log("No Gemini API key found");
      return c.json({
        success: false,
        error: "No Gemini API key configured"
      }, 500);
    }

    // Simple prompt for testing
    const testPrompt = `You are a professional prompt enhancer. Transform this basic prompt into a detailed, structured instruction that will help an AI generate better results.

Original prompt: "${originalPrompt}"

Provide a detailed enhanced version that includes:
1. Clear role definition
2. Specific task description  
3. Target audience
4. Desired output format
5. Key constraints or requirements

Make the enhanced prompt 2-3x more detailed and specific than the original.`;

    console.log(`Making Gemini API call...`);

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: testPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    console.log(`Gemini response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.log(`Gemini API error: ${errorText}`);
      return c.json({
        success: false,
        error: `Gemini API error: ${response.status}`
      }, 500);
    }

    const data = await response.json();
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!enhancedText) {
      console.log("No enhanced text in response");
      return c.json({
        success: false,
        error: "No enhanced text generated"
      }, 500);
    }

    console.log(`Successfully enhanced prompt: ${enhancedText.substring(0, 100)}...`);

    return c.json({
      success: true,
      enhancedPrompt: {
        english: enhancedText,
        detailed: enhancedText,
        short: enhancedText.substring(0, 200) + "..."
      },
      jsonFormat: JSON.stringify({
        role: "Professional Prompt Enhancer",
        task: `Enhance: ${originalPrompt}`,
        audience: "AI systems and users",
        framework: "Structured prompt enhancement",
        format: "Detailed, actionable instruction",
        constraints: "Maintain original intent while adding specificity",
        example: enhancedText.substring(0, 150) + "..."
      }, null, 2),
      mode: mode || 'direct'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.log(`Enhancement error: ${errorMessage}`);
    return c.json({
      success: false,
      error: errorMessage
    }, 500);
  }
});

export default app;
