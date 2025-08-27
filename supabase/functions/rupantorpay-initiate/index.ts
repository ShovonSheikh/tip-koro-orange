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
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    // Get authenticated user
    const authHeader = req.headers.get("Authorization")!;
    const token = authHeader.replace("Bearer ", "");
    const { data } = await supabaseClient.auth.getUser(token);
    const user = data.user;

    if (!user) {
      throw new Error("User not authenticated");
    }

    const body = await req.json();
    const { amount, orderType, creatorId, donorName, donorEmail, message } = body;

    console.log('Payment initiation request:', { amount, orderType, creatorId, user: user.id });

    // Create Supabase service client for database operations
    const supabaseService = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );

    // Generate unique order number
    const { data: sequenceData } = await supabaseService
      .from('order_sequence')
      .select('last_order_number')
      .single();

    const nextOrderNumber = (sequenceData?.last_order_number || 0) + 1;
    
    // Update sequence
    await supabaseService
      .from('order_sequence')
      .upsert({ id: 1, last_order_number: nextOrderNumber });

    const orderNumber = `ORD-${String(nextOrderNumber).padStart(6, '0')}`;

    // Create order record
    const { data: order, error: orderError } = await supabaseService
      .from('orders')
      .insert({
        user_id: user.id,
        order_number: orderNumber,
        order_type: orderType,
        creator_id: creatorId,
        total_amount: amount,
        currency: 'BDT',
        billing_address: {
          name: donorName || user.email,
          email: donorEmail || user.email
        }
      })
      .select()
      .single();

    if (orderError) {
      console.error('Order creation error:', orderError);
      throw new Error('Failed to create order');
    }

    // Generate transaction ID
    const transactionId = `TXN_${order.id}_${Date.now()}`;

    // Create payment record
    const { error: paymentError } = await supabaseService
      .from('payments')
      .insert({
        order_id: order.id,
        user_id: user.id,
        amount: amount,
        transaction_id: transactionId,
        payment_method: 'rupantorpay'
      });

    if (paymentError) {
      console.error('Payment creation error:', paymentError);
      throw new Error('Failed to create payment record');
    }

    // Prepare RupantorPay API call
    const rupantorPayload = {
      success_url: `${req.headers.get("origin")}/payment-success?transaction_id=${transactionId}`,
      cancel_url: `${req.headers.get("origin")}/payment-cancel`,
      webhook_url: `${Deno.env.get("SUPABASE_URL")}/functions/v1/rupantorpay-webhook`,
      fullname: donorName || user.email?.split('@')[0] || 'Anonymous',
      email: donorEmail || user.email || 'guest@example.com',
      amount: amount.toString()
    };

    console.log('Calling RupantorPay API with:', rupantorPayload);

    // Call RupantorPay API
    const response = await fetch('https://payment.rupantorpay.com/api/payment/checkout', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': Deno.env.get('RUPANTORPAY_API_KEY') || '',
        'content-type': 'application/json'
      },
      body: JSON.stringify(rupantorPayload)
    });

    const responseData = await response.json();
    console.log('RupantorPay response:', responseData);

    if (!response.ok || !responseData.status) {
      throw new Error(`RupantorPay API error: ${responseData.message || 'Unknown error'}`);
    }

    return new Response(JSON.stringify({
      success: true,
      paymentUrl: responseData.payment_url,
      transactionId: transactionId,
      orderId: order.id
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (error) {
    console.error('Payment initiation error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error.message
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});