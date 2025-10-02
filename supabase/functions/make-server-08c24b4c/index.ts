import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
      },
    });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ success: false, error: 'Only POST method allowed' }),
      { 
        status: 405, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }

  // Enhanced prompt endpoint
  const enhancePrompt = async () => {
  try {
    const body = await req.json();
    const { mode, originalPrompt, flowData } = body;

    console.log(`Received request: mode=${mode}, prompt="${originalPrompt}"`);

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    console.log(`Gemini API key found: ${geminiApiKey ? 'YES' : 'NO'}`);
    
    if (!geminiApiKey) {
      console.log("No Gemini API key found");
      return new Response(
        JSON.stringify({ success: false, error: "No Gemini API key configured" }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }
    
    // Enhanced prompt with rulebook system
    const rulebook = `SYSTEM PROMPT (PromptBrain 3.0 Rulebook):
You are PromptBrain 3.0, an advanced AI prompt enhancement system that transforms basic user inputs into highly effective, structured prompts.

CORE PRINCIPLES:
1. Always maintain the user's original intent
2. Add structure, clarity, and specificity
3. Include role, task, audience, framework, format, constraints, and examples
4. Optimize for maximum AI response quality

ENHANCEMENT FRAMEWORKS:
- ROLE: Define the AI's perspective/expertise
- TASK: Specify the exact action to perform
- AUDIENCE: Identify who the output is for
- FRAMEWORK: Select appropriate methodology
- FORMAT: Define output structure
- CONSTRAINTS: Set boundaries and requirements
- EXAMPLE: Provide sample output format

PROMPT ENHANCEMENT STRATEGIES:
- Transform vague requests into specific, actionable instructions
- Add context and background information when helpful
- Include relevant examples or templates
- Specify output format and length requirements
- Add constraints to focus the response
- Define the AI's role and expertise level

QUALITY STANDARDS:
- Enhanced prompts should be 2-3x more detailed than original
- Always include specific output format requirements
- Provide clear success criteria
- Include relevant context and examples
- Maintain professional tone and clarity`;

    const enhancedPrompt = `${rulebook}

USER PROMPT (to refine): "${originalPrompt}"
MODE: ${mode.toUpperCase()}

Transform this basic prompt into a comprehensive, professional instruction that will produce exceptional AI results. Follow the PromptBrain 3.0 framework to create a detailed enhancement that includes:

1. **Role Definition**: Define the AI's expertise and perspective
2. **Task Specification**: Break down the exact actions needed
3. **Audience Identification**: Specify who the output is for
4. **Framework Selection**: Choose the best methodology
5. **Output Format**: Define structure, length, and delivery method
6. **Constraints & Requirements**: Set clear boundaries and criteria
7. **Context & Examples**: Provide relevant background and samples

Make the enhanced prompt significantly more detailed, specific, and actionable than the original. Focus on creating a prompt that will generate high-quality, professional results.`;

    console.log(`Making Gemini API call...`);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: enhancedPrompt
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
      return new Response(
        JSON.stringify({ success: false, error: `Gemini API error: ${response.status}` }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }
    
    const data = await response.json();
    const enhancedText = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if (!enhancedText) {
      console.log("No enhanced text in response");
      return new Response(
        JSON.stringify({ success: false, error: "No enhanced text generated" }),
        { 
          status: 500, 
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          } 
        }
      );
    }
    
    console.log(`Successfully enhanced prompt: ${enhancedText.substring(0, 100)}...`);

    return new Response(
      JSON.stringify({
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
      }),
      { 
        status: 200, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
    
  } catch (error) {
    console.log(`Enhancement error: ${error.message}`);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { 
        status: 500, 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        } 
      }
    );
  }
  };

  return await enhancePrompt();
});
