import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the user from the JWT token
    const {
      data: { user },
    } = await supabaseClient.auth.getUser()

    if (!user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const { method } = req
    const url = new URL(req.url)
    const action = url.pathname.split('/').pop()

    switch (method) {
      case 'GET':
        if (action === 'balance') {
          // Get user balance (automatically refreshes daily credits)
          const { data, error } = await supabaseClient.rpc('get_user_balance', {
            p_user_id: user.id
          })

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          return new Response(
            JSON.stringify(data),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        if (action === 'refresh') {
          // Manually refresh daily credits
          const { data, error } = await supabaseClient.rpc('refresh_daily_credits', {
            p_user_id: user.id
          })

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          return new Response(
            JSON.stringify(data),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        break

      case 'POST':
        const body = await req.json()

        if (action === 'spend') {
          // Spend credits (automatically refreshes daily credits first)
          const { prompt_id, amount = 1, reason = 'prompt_enhancement' } = body

          const { data, error } = await supabaseClient.rpc('spend_credits', {
            p_user_id: user.id,
            p_prompt_id: prompt_id,
            p_amount: amount,
            p_reason: reason
          })

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          return new Response(
            JSON.stringify(data),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }

        if (action === 'add') {
          // Add credits
          const { amount, reason = 'credit_purchase' } = body

          if (!amount || amount <= 0) {
            return new Response(
              JSON.stringify({ error: 'Invalid amount' }),
              { 
                status: 400, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          const { data, error } = await supabaseClient.rpc('add_credits', {
            p_user_id: user.id,
            p_amount: amount,
            p_reason: reason
          })

          if (error) {
            return new Response(
              JSON.stringify({ error: error.message }),
              { 
                status: 500, 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
              }
            )
          }

          return new Response(
            JSON.stringify(data),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          )
        }
        break
    }

    return new Response(
      JSON.stringify({ error: 'Not found' }),
      { 
        status: 404, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})