import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js";
import * as kv from "./kv-utils.tsx";

// Cache for rulebook content
let rulebookCache: string | null = null;
let rulebookCacheTime: number = 0;
const RULEBOOK_CACHE_DURATION = 300000; // 5 minutes in milliseconds

const app = new Hono();

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-08c24b4c/health", (c) => {
  return c.json({ status: "ok" });
});

// User signup endpoint
app.post("/make-server-08c24b4c/auth/signup", async (c) => {
  try {
    const body = await c.req.json();
    const { email, password, fullName } = body;

    if (!email || !password || !fullName) {
      return c.json({ error: "Email, password, and full name are required" }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        full_name: fullName,
        display_name: fullName 
      },
      // Automatically confirm the user's email since an email server hasn't been configured.
      email_confirm: true
    });

    if (error) {
      console.log(`Signup error for ${email}: ${error.message}`);
      return c.json({ error: error.message }, 400);
    }

    // Store additional user profile data in KV store
    const userId = data.user.id;
    await kv.set(`user_profile:${userId}`, {
      id: userId,
      email,
      full_name: fullName,
      created_at: new Date().toISOString(),
      login_count: 0,
      last_login: null,
      account_status: 'active'
    });

    console.log(`User created successfully: ${email}`);
    return c.json({ 
      success: true, 
      user: { 
        id: userId, 
        email, 
        full_name: fullName 
      } 
    });

  } catch (error) {
    console.log(`Signup error: ${error}`);
    return c.json({ error: "Internal server error during signup" }, 500);
  }
});

// Create profile for OAuth users
app.post("/make-server-08c24b4c/auth/create-oauth-profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`OAuth profile creation error: ${error?.message || 'No user found'}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    const body = await c.req.json();
    const { fullName, email } = body;

    // Check if profile already exists
    const existingProfile = await kv.get(`user_profile:${user.id}`);
    if (existingProfile) {
      console.log(`Profile already exists for OAuth user: ${email}`);
      return c.json({ success: true, user: existingProfile });
    }

    // Create new profile for OAuth user
    const profileData = {
      id: user.id,
      email: email || user.email,
      full_name: fullName || user.user_metadata?.full_name || user.user_metadata?.name,
      created_at: new Date().toISOString(),
      login_count: 1,
      last_login: new Date().toISOString(),
      account_status: 'active',
      auth_provider: 'oauth'
    };

    await kv.set(`user_profile:${user.id}`, profileData);

    console.log(`OAuth profile created for: ${email}`);
    return c.json({ 
      success: true, 
      user: profileData
    });

  } catch (error) {
    console.log(`OAuth profile creation error: ${error}`);
    return c.json({ error: "Internal server error creating OAuth profile" }, 500);
  }
});

// User profile endpoint (requires authentication)
app.get("/make-server-08c24b4c/auth/profile", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      console.log(`Profile access error: ${error?.message || 'No user found'}`);
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user profile from KV store
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (!profile) {
      return c.json({ error: "Profile not found" }, 404);
    }

    return c.json({ user: profile });

  } catch (error) {
    console.log(`Profile fetch error: ${error}`);
    return c.json({ error: "Internal server error fetching profile" }, 500);
  }
});

// Update login tracking (called after successful login)
app.post("/make-server-08c24b4c/auth/track-login", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get current profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile) {
      // Update login tracking
      const updatedProfile = {
        ...profile,
        login_count: (profile.login_count || 0) + 1,
        last_login: new Date().toISOString()
      };
      
      await kv.set(`user_profile:${user.id}`, updatedProfile);
      
      console.log(`Login tracked for user: ${user.email}`);
      return c.json({ success: true });
    }

    return c.json({ error: "Profile not found" }, 404);

  } catch (error) {
    console.log(`Login tracking error: ${error}`);
    return c.json({ error: "Internal server error tracking login" }, 500);
  }
});

// Update user role after onboarding step 1
app.post("/make-server-08c24b4c/auth/update-role", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const body = await c.req.json();
    const { role } = body;
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    if (!role || !['creator', 'founder', 'researcher'].includes(role)) {
      return c.json({ error: "Valid role is required (creator, founder, researcher)" }, 400);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get current profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile) {
      // Update profile with role
      const updatedProfile = {
        ...profile,
        role: role,
        role_selected_at: new Date().toISOString()
      };
      
      await kv.set(`user_profile:${user.id}`, updatedProfile);
      
      console.log(`Role updated for user: ${user.email} -> ${role}`);
      return c.json({ success: true, user: updatedProfile });
    }

    return c.json({ error: "Profile not found" }, 404);

  } catch (error) {
    console.log(`Role update error: ${error}`);
    return c.json({ error: "Internal server error updating role" }, 500);
  }
});

// Get user statistics (requires authentication)
app.get("/make-server-08c24b4c/user/stats", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user profile for credits info
    const profile = await kv.get(`user_profile:${user.id}`);
    const userStats = await kv.get(`user_stats:${user.id}`);

    // Get saved prompts count
    const savedPrompts = await kv.getByPrefix(`enhancement:${user.id}:`);
    
    // Calculate default stats if no data exists yet
    const stats = {
      prompts_enhanced: userStats?.prompts_enhanced || 0,
      credits_remaining: profile?.temple_keys || 0,
      direct_mode_count: userStats?.direct_mode_count || 0,
      guided_mode_count: userStats?.guided_mode_count || 0,
      flow_mode_count: userStats?.flow_mode_count || 0,
      current_streak: userStats?.current_streak || 0,
      efficiency_score: userStats?.efficiency_score || 100,
      total_saved_prompts: savedPrompts.length,
      account_type: profile?.account_type || 'free',
      most_used_mode: getMostUsedMode(userStats),
      weekly_goal_progress: calculateWeeklyProgress(userStats),
      recent_activity: await getRecentActivity(user.id)
    };

    return c.json({ success: true, stats });

  } catch (error) {
    console.log(`User stats error: ${error}`);
    return c.json({ error: "Internal server error fetching user stats" }, 500);
  }
});

// Get saved prompts for user (requires authentication)
app.get("/make-server-08c24b4c/user/saved-prompts", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get user's enhancement history
    const enhancements = await kv.getByPrefix(`enhancement:${user.id}:`);
    
    // Sort by date (most recent first) and format for frontend
    const savedPrompts = enhancements
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 50) // Limit to last 50 for performance
      .map(enhancement => ({
        id: enhancement.user_id + '_' + enhancement.created_at,
        title: enhancement.original_prompt.substring(0, 50) + (enhancement.original_prompt.length > 50 ? '...' : ''),
        content: enhancement.enhanced_prompt,
        original: enhancement.original_prompt,
        mode: enhancement.mode || 'direct',
        category: inferCategory(enhancement.original_prompt),
        created_at: enhancement.created_at,
        date: enhancement.date
      }));

    return c.json({ success: true, saved_prompts: savedPrompts });

  } catch (error) {
    console.log(`Saved prompts error: ${error}`);
    return c.json({ error: "Internal server error fetching saved prompts" }, 500);
  }
});

// Helper functions for stats calculation
function getMostUsedMode(userStats: any): string {
  if (!userStats) return 'direct';
  
  const directCount = userStats.direct_mode_count || 0;
  const guidedCount = userStats.guided_mode_count || 0;
  const flowCount = userStats.flow_mode_count || 0;
  
  if (directCount >= guidedCount && directCount >= flowCount) return 'direct';
  if (guidedCount >= flowCount) return 'guided';
  return 'flow';
}

function calculateWeeklyProgress(userStats: any): number {
  if (!userStats?.last_enhancement_date) return 0;
  
  const today = new Date();
  const weekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - today.getDay());
  const lastEnhancement = new Date(userStats.last_enhancement_date);
  
  // Simple calculation - if enhanced this week, show progress
  if (lastEnhancement >= weekStart) {
    const weeklyGoal = 15; // Assume 15 enhancements per week goal
    const thisWeekCount = Math.min(userStats.prompts_enhanced || 0, weeklyGoal);
    return Math.round((thisWeekCount / weeklyGoal) * 100);
  }
  
  return 0;
}

async function getRecentActivity(userId: string): Promise<any[]> {
  try {
    const recentEnhancements = await kv.getByPrefix(`enhancement:${userId}:`);
    return recentEnhancements
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 5)
      .map(e => ({
        type: 'enhancement',
        mode: e.mode,
        date: e.created_at
      }));
  } catch (error) {
    return [];
  }
}

function inferCategory(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('business') || lowerPrompt.includes('marketing') || lowerPrompt.includes('strategy')) {
    return 'business';
  } else if (lowerPrompt.includes('design') || lowerPrompt.includes('creative') || lowerPrompt.includes('art')) {
    return 'design';
  } else if (lowerPrompt.includes('analyze') || lowerPrompt.includes('data') || lowerPrompt.includes('research')) {
    return 'analytics';
  } else if (lowerPrompt.includes('learn') || lowerPrompt.includes('teach') || lowerPrompt.includes('education')) {
    return 'education';
  } else {
    return 'creative';
  }
}

// Complete onboarding flow
app.post("/make-server-08c24b4c/auth/complete-onboarding", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Get current profile
    const profile = await kv.get(`user_profile:${user.id}`);
    
    if (profile) {
      // Mark onboarding as complete and grant credits
      const updatedProfile = {
        ...profile,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
        temple_keys: 10, // Grant 10 free credits
        account_status: 'active'
      };
      
      await kv.set(`user_profile:${user.id}`, updatedProfile);
      
      console.log(`Onboarding completed for user: ${user.email}`);
      return c.json({ success: true, user: updatedProfile });
    }

    return c.json({ error: "Profile not found" }, 404);

  } catch (error) {
    console.log(`Onboarding completion error: ${error}`);
    return c.json({ error: "Internal server error completing onboarding" }, 500);
  }
});

// Get user stats (admin endpoint)
app.get("/make-server-08c24b4c/admin/user-stats", async (c) => {
  try {
    // In a real app, you'd verify admin permissions here
    const allProfiles = await kv.getByPrefix('user_profile:');
    
    const stats = {
      total_users: allProfiles.length,
      active_users: allProfiles.filter(p => p.account_status === 'active').length,
      users_with_logins: allProfiles.filter(p => (p.login_count || 0) > 0).length,
      completed_onboarding: allProfiles.filter(p => p.onboarding_completed).length,
      total_logins: allProfiles.reduce((sum, p) => sum + (p.login_count || 0), 0),
      roles: {
        creator: allProfiles.filter(p => p.role === 'creator').length,
        founder: allProfiles.filter(p => p.role === 'founder').length,
        researcher: allProfiles.filter(p => p.role === 'researcher').length
      }
    };

    return c.json({ stats });

  } catch (error) {
    console.log(`User stats error: ${error}`);
    return c.json({ error: "Internal server error fetching stats" }, 500);
  }
});

// Get current rulebook content (admin endpoint)
app.get("/make-server-08c24b4c/admin/rulebook", async (c) => {
  try {
    const rulebook = await loadRulebook();
    return c.json({ success: true, rulebook });
  } catch (error) {
    console.log(`Error fetching rulebook: ${error}`);
    return c.json({ error: "Error fetching rulebook" }, 500);
  }
});

// Update rulebook content (admin endpoint)
app.post("/make-server-08c24b4c/admin/rulebook", async (c) => {
  try {
    const body = await c.req.json();
    const { rulebook } = body;
    
    if (!rulebook || typeof rulebook !== 'string') {
      return c.json({ error: "Valid rulebook content is required" }, 400);
    }
    
    // Store in KV store for persistence
    await kv.set('system:rulebook', {
      content: rulebook,
      updated_at: new Date().toISOString(),
      version: Date.now()
    });
    
    // Clear cache to force reload
    rulebookCache = null;
    rulebookCacheTime = 0;
    
    console.log('Rulebook updated successfully');
    return c.json({ success: true, message: "Rulebook updated successfully" });
    
  } catch (error) {
    console.log(`Error updating rulebook: ${error}`);
    return c.json({ error: "Error updating rulebook" }, 500);
  }
});

// Enhanced prompt endpoint with Flow Zone integration
app.post("/make-server-08c24b4c/enhance-prompt", async (c) => {
  let userId = null;
  
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const body = await c.req.json();
    const { mode, originalPrompt, flowData } = body;

    console.log(`Enhancing prompt in ${mode} mode`);

    if (accessToken) {
      // Verify user with access token (optional - allows anonymous usage)
      const { data: { user }, error } = await supabase.auth.getUser(accessToken);
      if (user?.id) {
        userId = user.id;
      }
    }

    // Validate Flow Zone data
    if (mode === 'flow' && (!flowData || !flowData.audience || !flowData.purpose)) {
      return c.json({ error: "Flow mode requires audience and purpose" }, 400);
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    
    if (!geminiApiKey) {
      console.log("No Gemini API key found, using local enhancement");
      return generateLocalEnhancement(c, mode, originalPrompt, flowData);
    }

    // Prepare Gemini API request with rulebook integration
    const geminiPrompt = await createGeminiPrompt(mode, originalPrompt, flowData);
    
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: geminiPrompt
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

    if (geminiResponse.ok) {
      const geminiData = await geminiResponse.json();
      const enhancedContent = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (enhancedContent) {
        // Parse enhanced content using rulebook format
        const { short, detailed } = extractEnhancedPrompt(enhancedContent);
        const jsonFormat = createJsonFormat(flowData, { short, detailed });
        
        console.log(`Prompt enhanced successfully using Gemini API with Rulebook`);
        
        // Track usage statistics if user is authenticated
        if (userId) {
          await trackPromptEnhancement(userId, mode, originalPrompt, detailed);
        }
        
        return c.json({
          success: true,
          enhancedPrompt: {
            short,
            detailed
          },
          jsonFormat,
          mode
        });
      }
    }

    // Fallback to local enhancement
    console.log("Gemini API failed, falling back to local enhancement");
    const localResult = await generateLocalEnhancement(c, mode, originalPrompt, flowData);
    
    // Track usage statistics if user is authenticated (local enhancement)
    if (userId) {
      const localEnhanced = `Enhanced: ${originalPrompt} - Optimized for clarity, specificity, and effectiveness.`;
      await trackPromptEnhancement(userId, mode, originalPrompt, localEnhanced);
    }
    
    return localResult;

  } catch (error) {
    console.log(`Enhancement error: ${error}`);
    const localResult = await generateLocalEnhancement(c, 'local', '', {});
    
    // Track usage statistics if user is authenticated (error fallback)
    if (userId) {
      await trackPromptEnhancement(userId, 'local', '', 'Error enhancement fallback');
    }
    
    return localResult;
  }
});

// Load rulebook from KV store or file system with caching
async function loadRulebook(): Promise<string> {
  const now = Date.now();
  
  // Return cached version if still valid
  if (rulebookCache && (now - rulebookCacheTime) < RULEBOOK_CACHE_DURATION) {
    return rulebookCache;
  }
  
  try {
    // First try to load from KV store (allows dynamic updates)
    const storedRulebook = await kv.get('system:rulebook');
    if (storedRulebook?.content) {
      console.log('Loaded rulebook from KV store');
      rulebookCache = storedRulebook.content;
      rulebookCacheTime = now;
      return rulebookCache;
    }
    
    // Fallback: try to read from file system
    try {
      const rulebookContent = await Deno.readTextFile('./config/rulebook.md');
      rulebookCache = rulebookContent;
      console.log('Loaded rulebook from file system');
    } catch (readError) {
      // Final fallback: use embedded rulebook
      console.log('Using embedded fallback rulebook');
      rulebookCache = `# PromptBrain Enhancement Rules

## Core Principles
- Expand vague inputs into clear, structured prompts
- Add context: audience, purpose, format, tone  
- Return both short (2-3 lines) and detailed (8-12 lines) versions
- Adapt to mode: Content, Research, Product, Creative
- Keep instructions actionable and specific

## Mode-Specific Guidelines
- **Content Creation**: Add audience, tone, length, SEO, outline
- **Research**: Require citations, structured findings, pros/cons
- **Product Specs**: Follow Problem → Solution → Features → Use Cases
- **Creative**: Enhance imagery, narrative flow, character depth

## Output Format
ALWAYS return exactly this format:
SHORT: [2-3 line enhanced prompt]

DETAILED: [8-12 line enhanced prompt with full context and structure]

## Quality Checklist
- Preserve original intent
- Add missing context
- Make actionable and specific
- Ensure professional tone
- Include clear expected outcomes`;
    }
    
    rulebookCacheTime = now;
    return rulebookCache;
  } catch (error) {
    console.log(`Error loading rulebook: ${error}, using minimal fallback`);
    return `Enhance prompts by adding context, clarity, and structure. Always return both SHORT and DETAILED versions.`;
  }
}

// Helper function to create Gemini prompt with rulebook integration
async function createGeminiPrompt(mode: string, originalPrompt: string, flowData: any): Promise<string> {
  const rulebook = await loadRulebook();
  
  if (mode === 'flow') {
    return `${rulebook}

TASK: Apply the PromptBrain rulebook to enhance this user input.

USER INPUT: "${originalPrompt || 'Create something based on the specifications'}"

FLOW SPECIFICATIONS:
- Audience: ${flowData.audience}
- Purpose: ${flowData.purpose}  
- Style: ${flowData.style}
- Constraints: ${flowData.constraints || 'None'}

INSTRUCTIONS: 
1. Apply the rulebook principles above
2. Create TWO versions as specified:
   - Short (2-3 lines): Concise, clear version
   - Detailed (8-12 lines): Full context, structured version
3. Incorporate all flow specifications
4. Ensure outputs are actionable and professional

FORMAT YOUR RESPONSE EXACTLY AS:
SHORT: [2-3 line enhanced prompt]

DETAILED: [8-12 line enhanced prompt with full context and structure]`;
  }
  
  // For direct/guided modes
  return `${rulebook}

TASK: Apply the PromptBrain rulebook to enhance this user input.

USER INPUT: "${originalPrompt}"
MODE: ${mode}

INSTRUCTIONS:
1. Apply the rulebook principles above
2. Create TWO versions as specified:
   - Short (2-3 lines): Concise, clear version  
   - Detailed (8-12 lines): Full context, structured version
3. Adapt tone and style for ${mode} mode
4. Ensure outputs are actionable and professional

FORMAT YOUR RESPONSE EXACTLY AS:
SHORT: [2-3 line enhanced prompt]

DETAILED: [8-12 line enhanced prompt with full context and structure]`;
}

// Helper function to extract enhanced prompt from Gemini response
function extractEnhancedPrompt(content: string): { short: string; detailed: string } {
  try {
    // Clean up the response
    const cleanContent = content.trim()
      .replace(/^```[\w]*\n?/, '')  // Remove opening code blocks
      .replace(/\n?```$/, '')       // Remove closing code blocks;
    
    // Try to parse SHORT and DETAILED sections
    const shortMatch = cleanContent.match(/SHORT:\s*(.*?)(?=\n\nDETAILED:|$)/s);
    const detailedMatch = cleanContent.match(/DETAILED:\s*(.*?)$/s);
    
    if (shortMatch && detailedMatch) {
      return {
        short: shortMatch[1].trim(),
        detailed: detailedMatch[1].trim()
      };
    }
    
    // Fallback - try to split by paragraphs if format isn't followed
    const paragraphs = cleanContent.split('\n\n').filter(p => p.trim());
    if (paragraphs.length >= 2) {
      return {
        short: paragraphs[0].replace(/^SHORT:\s*/i, '').trim(),
        detailed: paragraphs.slice(1).join('\n\n').replace(/^DETAILED:\s*/i, '').trim()
      };
    }
    
    // Last resort - use entire content as detailed, create short version
    const shortVersion = cleanContent.split('.')[0] + '.';
    return {
      short: shortVersion.length > 150 ? cleanContent.substring(0, 150) + '...' : shortVersion,
      detailed: cleanContent
    };
    
  } catch (error) {
    console.log(`Error parsing enhanced prompt: ${error}`);
    return {
      short: content.substring(0, 100) + '...',
      detailed: content
    };
  }
}

// Helper function to create JSON format
function createJsonFormat(flowData: any, enhancedPrompt: { short: string; detailed: string } | string): string {
  const jsonData = {
    audience: flowData?.audience || 'General audience',
    purpose: flowData?.purpose || 'General purpose', 
    tone: flowData?.style || 'Professional',
    constraints: flowData?.constraints || 'No specific constraints',
    enhanced_prompt: typeof enhancedPrompt === 'string' ? {
      short: enhancedPrompt.length > 150 ? enhancedPrompt.substring(0, 150) + '...' : enhancedPrompt,
      detailed: enhancedPrompt
    } : enhancedPrompt
  };
  
  return JSON.stringify(jsonData, null, 2);
}

// Helper function to track prompt enhancement usage
async function trackPromptEnhancement(userId: string, mode: string, originalPrompt: string, enhancedPrompt: string) {
  try {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
    
    // Get user's current stats
    const userStats = await kv.get(`user_stats:${userId}`) || {
      prompts_enhanced: 0,
      direct_mode_count: 0,
      guided_mode_count: 0,
      flow_mode_count: 0,
      last_enhancement_date: null,
      streak_start_date: null,
      current_streak: 0,
      total_credits_used: 0,
      efficiency_score: 100,
      created_at: new Date().toISOString(),
    };

    // Update enhancement counts
    userStats.prompts_enhanced = (userStats.prompts_enhanced || 0) + 1;
    
    // Update mode-specific counts
    if (mode === 'direct') {
      userStats.direct_mode_count = (userStats.direct_mode_count || 0) + 1;
    } else if (mode === 'guided') {
      userStats.guided_mode_count = (userStats.guided_mode_count || 0) + 1;
    } else if (mode === 'flow') {
      userStats.flow_mode_count = (userStats.flow_mode_count || 0) + 1;
    }

    // Update streak tracking
    const lastDate = userStats.last_enhancement_date ? new Date(userStats.last_enhancement_date).toISOString().split('T')[0] : null;
    
    if (lastDate === today) {
      // Same day - no change to streak
    } else if (lastDate) {
      const daysDiff = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysDiff === 1) {
        // Consecutive day - extend streak
        userStats.current_streak = (userStats.current_streak || 0) + 1;
      } else if (daysDiff > 1) {
        // Streak broken - start new streak
        userStats.current_streak = 1;
        userStats.streak_start_date = today;
      }
    } else {
      // First enhancement - start streak
      userStats.current_streak = 1;
      userStats.streak_start_date = today;
    }

    userStats.last_enhancement_date = today;
    
    // Calculate efficiency score based on enhancement quality (simplified)
    const enhancementRatio = enhancedPrompt.length / Math.max(originalPrompt.length, 1);
    const qualityScore = Math.min(100, Math.max(50, 100 - Math.abs(enhancementRatio - 2) * 20));
    userStats.efficiency_score = Math.round((userStats.efficiency_score * 0.9) + (qualityScore * 0.1));

    // Save updated stats
    await kv.set(`user_stats:${userId}`, userStats);

    // Save individual enhancement record for history
    const enhancementId = `enhancement:${userId}:${Date.now()}`;
    await kv.set(enhancementId, {
      user_id: userId,
      mode,
      original_prompt: originalPrompt.substring(0, 500), // Limit storage
      enhanced_prompt: enhancedPrompt.substring(0, 1000),
      created_at: new Date().toISOString(),
      date: today
    });

    console.log(`Stats tracked for user ${userId}: ${userStats.prompts_enhanced} total enhancements`);
  } catch (error) {
    console.log(`Error tracking stats for user ${userId}: ${error}`);
  }
}

// Helper function for local enhancement fallback
async function generateLocalEnhancement(c: any, mode: string, originalPrompt: string, flowData: any) {
  try {
    // Apply basic rulebook principles even for local enhancement
    const rulebook = await loadRulebook();
    
    let shortPrompt: string;
    let detailedPrompt: string;
    
    if (mode === 'flow' && flowData) {
      const audience = flowData.audience || 'general audience';
      const purpose = flowData.purpose || 'general purpose';
      const style = flowData.style || 'professional';
      const constraints = flowData.constraints ? ` with constraints: ${flowData.constraints}` : '';
      
      shortPrompt = `Create a ${style.toLowerCase()} ${purpose.toLowerCase()} for ${audience.toLowerCase()}.`;
      detailedPrompt = `Create a comprehensive ${style.toLowerCase()} ${purpose.toLowerCase()} specifically tailored for ${audience.toLowerCase()}. Ensure the content is well-structured, engaging, and meets professional standards${constraints}. Include clear objectives, actionable insights, and relevant examples where appropriate.`;
    } else {
      shortPrompt = originalPrompt ? 
        `Enhanced: ${originalPrompt.substring(0, 100)}${originalPrompt.length > 100 ? '...' : ''}` :
        'Create a comprehensive and well-structured response.';
      
      detailedPrompt = originalPrompt ? 
        `Enhanced version: ${originalPrompt} - Optimized for clarity, specificity, and effectiveness. Provide structured information with clear headings, actionable insights, and relevant examples. Ensure the content is professional, engaging, and tailored to the intended audience.` :
        'Create a comprehensive and well-structured response tailored to your specific needs. Include clear objectives, detailed explanations, and actionable recommendations.';
    }
    
    const enhancedPrompt = { short: shortPrompt, detailed: detailedPrompt };
    const jsonFormat = createJsonFormat(flowData, enhancedPrompt);
    
    return c.json({
      success: true,
      enhancedPrompt,
      jsonFormat,
      mode: mode || 'local'
    });
  } catch (error) {
    console.log(`Local enhancement error: ${error}`);
    const fallbackPrompt = {
      short: 'Create a clear and effective response.',
      detailed: 'Create a comprehensive, well-structured response that addresses the user\'s needs with clarity and professionalism.'
    };
    
    return c.json({
      success: true,
      enhancedPrompt: fallbackPrompt,
      jsonFormat: createJsonFormat(flowData, fallbackPrompt),
      mode: 'fallback'
    });
  }
}

// Save prompt to user's collection
app.post("/make-server-08c24b4c/user/save-prompt", async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const body = await c.req.json();
    const { title, content, original, mode, category } = body;
    
    if (!accessToken) {
      return c.json({ error: "No access token provided" }, 401);
    }

    if (!title || !content) {
      return c.json({ error: "Title and content are required" }, 400);
    }

    // Verify user with access token
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);
    
    if (error || !user?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Save the prompt with timestamp
    const promptId = `saved_prompt:${user.id}:${Date.now()}`;
    const promptData = {
      user_id: user.id,
      title: title.substring(0, 100), // Limit title length
      content: content.substring(0, 2000), // Limit content length
      original_prompt: original?.substring(0, 1000) || '',
      mode: mode || 'direct',
      category: category || 'General',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    await kv.set(promptId, promptData);

    console.log(`Prompt saved for user ${user.email}: ${title}`);
    return c.json({ 
      success: true, 
      message: "Prompt saved successfully",
      prompt: {
        id: promptId,
        ...promptData
      }
    });

  } catch (error) {
    console.log(`Save prompt error: ${error}`);
    return c.json({ error: "Internal server error saving prompt" }, 500);
  }
});

// Initialize system data on startup
async function initializeSystem() {
  try {
    // Check if rulebook exists in KV store, if not, initialize it
    const existingRulebook = await kv.get('system:rulebook');
    if (!existingRulebook) {
      console.log('Initializing rulebook in KV store...');
      const initialRulebook = await loadRulebook(); // This will load from our embedded fallback
      await kv.set('system:rulebook', {
        content: initialRulebook,
        updated_at: new Date().toISOString(),
        version: Date.now(),
        source: 'initial_setup'
      });
      console.log('Rulebook initialized successfully');
    }
  } catch (error) {
    console.log(`Error initializing system: ${error}`);
  }
}

// Initialize system on startup
initializeSystem();

Deno.serve(app.fetch);