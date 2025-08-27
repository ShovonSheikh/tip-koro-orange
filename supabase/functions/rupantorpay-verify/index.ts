import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { transaction_id } = body;

    console.log('Manual verification request:', { transaction_id });

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Get payment record
    const { data: payment, error: paymentError } = await supabaseService
      .from('payments')
      .select('*, orders(*)')
      .eq('transaction_id', transaction_id)
      .single();

    if (paymentError || !payment) {
      throw new Error('Payment not found');
    }

    // Verify with RupantorPay
    const verifyResponse = await fetch('https://payment.rupantorpay.com/api/payment/verify-payment', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': Deno.env.get('RUPANTORPAY_API_KEY') || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify({ transaction_id })
    });

    const verificationData = await verifyResponse.json();
    console.log('Verification response:', verificationData);

    // Update payment status if needed
    const newStatus = verificationData.status && verificationData.payment_status === 'completed' ? 'completed' : 'failed';
    
    if (payment.status !== newStatus) {
      await supabaseService
        .from('payments')
        .update({
          status: newStatus,
          gateway_response: verificationData,
          updated_at: new Date().toISOString()
        })
        .eq('transaction_id', transaction_id);

      // Update order status
      const orderPaymentStatus = newStatus === 'completed' ? 'paid' : 'failed';
      await supabaseService
        .from('orders')
        .update({
          payment_status: orderPaymentStatus,
          gateway_response: verificationData,
          updated_at: new Date().toISOString()
        })
        .eq('id', payment.order_id);
    }

    return new Response(JSON.stringify({
      success: true,
      payment_status: newStatus,
      verification_data: verificationData,
      order: payment.orders
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Verification error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});