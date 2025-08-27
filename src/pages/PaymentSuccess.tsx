import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'failed' | 'error'>('loading');
  const [orderDetails, setOrderDetails] = useState<any>(null);

  useEffect(() => {
    const transactionId = searchParams.get('transaction_id');
    if (transactionId) {
      verifyPayment(transactionId);
    } else {
      setVerificationStatus('error');
    }
  }, [searchParams]);

  const verifyPayment = async (transactionId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('rupantorpay-verify', {
        body: { transaction_id: transactionId }
      });

      if (error) throw error;

      if (data.success && data.payment_status === 'completed') {
        setVerificationStatus('success');
        setOrderDetails(data.order);
      } else {
        setVerificationStatus('failed');
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      setVerificationStatus('error');
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case 'loading':
        return (
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
            <h2 className="text-2xl font-bold mb-2">Verifying Payment</h2>
            <p className="text-muted-foreground">Please wait while we confirm your payment...</p>
          </div>
        );

      case 'success':
        return (
          <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">Payment Successful!</h2>
            <p className="text-muted-foreground mb-4">Thank you for your payment. Your transaction has been completed successfully.</p>
            
            {orderDetails && (
              <div className="bg-muted p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Order Details</h3>
                <p><strong>Order Number:</strong> {orderDetails.order_number}</p>
                <p><strong>Amount:</strong> ৳{orderDetails.total_amount}</p>
                <p><strong>Type:</strong> {orderDetails.order_type}</p>
              </div>
            )}

            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
              {orderDetails?.order_type === 'subscription' && (
                <Button variant="outline" asChild>
                  <Link to="/creator-dashboard">View Dashboard</Link>
                </Button>
              )}
            </div>
          </div>
        );

      case 'failed':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Payment Failed</h2>
            <p className="text-muted-foreground mb-4">Unfortunately, your payment could not be processed. Please try again.</p>
            
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/creator-subscription">Try Again</Link>
              </Button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="text-center">
            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-red-700 mb-2">Verification Error</h2>
            <p className="text-muted-foreground mb-4">There was an error verifying your payment. Please contact support if the problem persists.</p>
            
            <Button asChild>
              <Link to="/">Go Home</Link>
            </Button>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Status</CardTitle>
        </CardHeader>
        <CardContent>
          {renderContent()}
        </CardContent>
      </Card>
    </div>
  );
}