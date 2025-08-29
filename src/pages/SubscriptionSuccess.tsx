import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const SubscriptionSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [transactionId, setTransactionId] = useState<string | null>(null);

  useEffect(() => {
    const txnId = searchParams.get('transaction_id');
    setTransactionId(txnId);

    if (txnId) {
      verifySubscriptionPayment(txnId);
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const verifySubscriptionPayment = async (txnId: string) => {
    try {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', txnId)
        .eq('payment_type', 'subscription')
        .single();

      if (payment && payment.status === 'completed') {
        setStatus('success');
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('failed');
    }
  };

  const handleGoToDashboard = () => {
    if (user) {
      // Get user profile to navigate to their dashboard
      supabase
        .from('users')
        .select('username')
        .eq('id', user.id)
        .single()
        .then(({ data }) => {
          if (data) {
            navigate(`/a/${data.username}`);
          } else {
            navigate('/');
          }
        });
    } else {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-md pt-20">
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            {status === 'verifying' && (
              <>
                <Clock className="w-16 h-16 mx-auto text-primary animate-spin" />
                <CardTitle className="text-2xl font-bold">Verifying Payment</CardTitle>
                <CardDescription>
                  Please wait while we confirm your subscription payment...
                </CardDescription>
              </>
            )}
            
            {status === 'success' && (
              <>
                <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                <CardTitle className="text-2xl font-bold text-green-700">Subscription Activated!</CardTitle>
                <CardDescription>
                  Your creator account is now active. You can start receiving donations!
                </CardDescription>
              </>
            )}
            
            {status === 'failed' && (
              <>
                <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
                <CardTitle className="text-2xl font-bold text-red-700">Payment Verification Failed</CardTitle>
                <CardDescription>
                  We couldn't verify your payment. Please contact support if you believe this is an error.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {transactionId && (
              <div className="text-sm text-muted-foreground text-center">
                Transaction ID: {transactionId}
              </div>
            )}

            <div className="space-y-2">
              {status === 'success' && (
                <>
                  <Button 
                    onClick={handleGoToDashboard}
                    className="w-full"
                  >
                    Go to Dashboard
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </>
              )}

              {status === 'failed' && (
                <>
                  <Button 
                    onClick={() => navigate('/auth')}
                    className="w-full"
                  >
                    Try Again
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => navigate('/')}
                    className="w-full"
                  >
                    Back to Home
                  </Button>
                </>
              )}

              {status === 'verifying' && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionSuccess;