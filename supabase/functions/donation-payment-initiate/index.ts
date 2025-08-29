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
    // Allow both authenticated and unauthenticated requests
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    let user = null;
    const authHeader = req.headers.get('Authorization');
    
    if (authHeader) {
      const { data } = await supabaseClient.auth.getUser(authHeader.replace('Bearer ', ''));
      user = data.user;
    }

    const { creatorId, amount, message, isAnonymous, donatorInfo } = await req.json()

    if (!creatorId || !amount || amount <= 0) {
      throw new Error('Invalid donation data')
    }

    // Create donation record
    const supabaseService = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    const { data: donation, error: donationError } = await supabaseService
      .from('donations')
      .insert({
        donor_id: user?.id || null,
        creator_id: creatorId,
        amount: amount,
        message: message || null,
        is_anonymous: isAnonymous || false,
        payment_status: 'pending',
        donor_name: donatorInfo?.donorName || 'Anonymous',
        donor_email: donatorInfo?.donorEmail || user?.email || 'guest@example.com'
      })
      .select()
      .single()

    if (donationError) throw new Error('Failed to create donation')

    // Create transaction ID
    const transactionId = `DON_${donation.id}_${Date.now()}`

    // Get origin for URLs
    const origin = req.headers.get('origin') || 'http://localhost:3000'

    const paymentData = {
      success_url: `${origin}/donation-success?transaction_id=${transactionId}&donation_id=${donation.id}`,
      cancel_url: `${origin}/donation-cancel`,
      webhook_url: `${Deno.env.get('SUPABASE_URL')}/functions/v1/donation-webhook`,
      fullname: donatorInfo?.donorName || 'Anonymous Donor',
      email: donatorInfo?.donorEmail || user?.email || 'guest@example.com',
      amount: amount.toString()
    }

    // Create payment record
    await supabaseService.from('payments').insert({
      user_id: user?.id || null,
      payment_type: 'donation',
      reference_id: donation.id,
      amount: amount,
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
    console.log('RupantorPay donation response:', result)

    if (result.status === true && result.payment_url) {
      return new Response(JSON.stringify({
        success: true,
        paymentUrl: result.payment_url,
        transactionId: transactionId,
        donationId: donation.id
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    } else {
      throw new Error(result.message || 'Payment initiation failed')
    }

  } catch (error) {
    console.error('Donation payment error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})