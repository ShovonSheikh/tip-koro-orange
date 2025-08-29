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
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const webhookData = await req.json()
    console.log('Subscription webhook received:', webhookData)
    
    const { transaction_id, status } = webhookData

    if (!transaction_id) {
      throw new Error('Transaction ID missing from webhook')
    }

    // Verify payment with RupantorPay
    const verifyResponse = await fetch('https://payment.rupantorpay.com/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': Deno.env.get('RUPANTORPAY_API_KEY') || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ transaction_id })
    })

    const verificationResult = await verifyResponse.json()
    console.log('Payment verification result:', verificationResult)

    // Update payment status
    let paymentStatus = 'failed'
    if (verificationResult.status === true && verificationResult.payment_status === 'completed') {
      paymentStatus = 'completed'
    }

    // Get payment record
    const { data: payment } = await supabaseService
      .from('payments')
      .select('*')
      .eq('transaction_id', transaction_id)
      .single()

    if (payment && payment.payment_type === 'subscription') {
      // Update payment status
      await supabaseService
        .from('payments')
        .update({
          status: paymentStatus,
          gateway_transaction_id: transaction_id,
          gateway_response: verificationResult
        })
        .eq('transaction_id', transaction_id)

      // Update subscription status
      if (paymentStatus === 'completed') {
        const now = new Date()
        const nextExpiry = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days

        await supabaseService
          .from('subscriptions')
          .update({
            status: 'active',
            starts_at: now.toISOString(),
            expires_at: nextExpiry.toISOString()
          })
          .eq('id', payment.reference_id)

        // Activate user subscription status
        await supabaseService
          .from('users')
          .update({ 
            subscription_status: 'active',
            subscription_expires_at: nextExpiry.toISOString()
          })
          .eq('id', payment.user_id)

        console.log('Subscription activated for user:', payment.user_id)
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully' 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })

  } catch (error) {
    console.error('Error in subscription webhook:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})