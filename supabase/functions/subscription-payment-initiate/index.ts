import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user } } = await supabaseClient.auth.getUser()
    if (!user) throw new Error('Unauthorized')

    const { creatorProfile } = await req.json()

    // Create subscription record
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: subscription, error: subError } = await supabaseService
      .from('subscriptions')
      .insert({
        user_id: user.id,
        amount: 100,
        status: 'pending',
        expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days
      })
      .select()
      .single()

    if (subError) throw new Error('Failed to create subscription')

    // Create transaction ID
    const transactionId = `SUB_${subscription.id}_${Date.now()}`

    // Get origin for URLs
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const paymentData = {
      success_url: `${origin}/subscription-success?transaction_id=${transactionId}`,
      cancel_url: `${origin}/subscription-cancel`,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/subscription-webhook`,
      fullname: creatorProfile.display_name || 'Creator',
      email: user.email,
      amount: '100'
    }

    // Create payment record
    await supabaseService.from('payments').insert({
      user_id: user.id,
      payment_type: 'subscription',
      reference_id: subscription.id,
      amount: 100,
      currency: 'BDT',
      transaction_id: transactionId,
      status: 'pending'
    })

    // Call RupantorPay API
    const rupantorPayResponse = await fetch('https://payment.rupantorpay.com/api/payment/checkout', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': Deno.env.get('RUPANTORPAY_API_KEY') || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })

    const result = await rupantorPayResponse.json()
    console.log('RupantorPay subscription response:', result)

    if (result.status === true && result.payment_url) {
      return new Response(JSON.stringify({
        success: true,
        paymentUrl: result.payment_url,
        transactionId: transactionId
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      throw new Error(result.message || 'Payment initiation failed')
    }

  } catch (error) {
    console.error('Subscription payment error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})