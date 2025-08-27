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
    const { transaction_id, status, amount } = body;

    console.log('Webhook received:', { transaction_id, status, amount });

    // Create Supabase service client
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Verify payment with RupantorPay
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

    // Update payment record
    const paymentStatus = verificationData.status && verificationData.payment_status === 'completed' ? 'completed' : 'failed';
    
    const { data: payment, error: paymentUpdateError } = await supabaseService
      .from('payments')
      .update({
        status: paymentStatus,
        gateway_transaction_id: verificationData.transaction_id,
        gateway_response: verificationData,
        updated_at: new Date().toISOString()
      })
      .eq('transaction_id', transaction_id)
      .select('order_id, user_id')
      .single();

    if (paymentUpdateError) {
      console.error('Payment update error:', paymentUpdateError);
      throw new Error('Failed to update payment');
    }

    // Update order record
    const orderPaymentStatus = paymentStatus === 'completed' ? 'paid' : 'failed';
    
    const { data: order, error: orderUpdateError } = await supabaseService
      .from('orders')
      .update({
        payment_status: orderPaymentStatus,
        transaction_id: transaction_id,
        gateway_response: verificationData,
        updated_at: new Date().toISOString()
      })
      .eq('id', payment.order_id)
      .select('order_type, creator_id, total_amount')
      .single();

    if (orderUpdateError) {
      console.error('Order update error:', orderUpdateError);
      throw new Error('Failed to update order');
    }

    // If payment is completed, handle specific order types
    if (paymentStatus === 'completed') {
      if (order.order_type === 'donation') {
        // Create donation record
        await supabaseService
          .from('donations')
          .insert({
            creator_id: order.creator_id,
            amount: order.total_amount,
            payment_status: 'completed',
            payment_id: transaction_id,
            donor_name: verificationData.customer_name || 'Anonymous',
            donor_email: verificationData.customer_email,
            message: 'Payment via RupantorPay'
          });

        console.log('Donation record created');
      } else if (order.order_type === 'subscription') {
        // Update user subscription
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days from now

        await supabaseService
          .from('users')
          .update({
            subscription_status: 'active',
            subscription_expires_at: expiresAt.toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('id', payment.user_id);

        // Create subscription record
        await supabaseService
          .from('subscriptions')
          .insert({
            user_id: payment.user_id,
            amount: order.total_amount,
            expires_at: expiresAt.toISOString(),
            payment_id: transaction_id,
            status: 'active'
          });

        console.log('Subscription activated');
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Webhook processing error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});