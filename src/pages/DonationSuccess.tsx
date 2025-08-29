import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, Clock, AlertCircle, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';

const DonationSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'failed'>('verifying');
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [donationId, setDonationId] = useState<string | null>(null);
  const [donationAmount, setDonationAmount] = useState<number | null>(null);

  useEffect(() => {
    const txnId = searchParams.get('transaction_id');
    const donId = searchParams.get('donation_id');
    setTransactionId(txnId);
    setDonationId(donId);

    if (txnId && donId) {
      verifyDonationPayment(txnId, donId);
    } else {
      setStatus('failed');
    }
  }, [searchParams]);

  const verifyDonationPayment = async (txnId: string, donId: string) => {
    try {
      // Wait a moment for webhook to process
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const { data: payment } = await supabase
        .from('payments')
        .select('*')
        .eq('transaction_id', txnId)
        .eq('payment_type', 'donation')
        .single();

      const { data: donation } = await supabase
        .from('donations')
        .select('amount')
        .eq('id', donId)
        .single();

      if (payment && payment.status === 'completed') {
        setStatus('success');
        setDonationAmount(donation?.amount || null);
      } else {
        setStatus('failed');
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('failed');
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
                <CardTitle className="text-2xl font-bold">Verifying Donation</CardTitle>
                <CardDescription>
                  Please wait while we confirm your donation...
                </CardDescription>
              </>
            )}
            
            {status === 'success' && (
              <>
                <div className="relative">
                  <CheckCircle className="w-16 h-16 mx-auto text-green-500" />
                  <Heart className="w-6 h-6 absolute top-0 right-[calc(50%-20px)] text-red-500 fill-current" />
                </div>
                <CardTitle className="text-2xl font-bold text-green-700">Donation Successful!</CardTitle>
                <CardDescription>
                  Thank you for supporting the creator. Your donation means a lot!
                </CardDescription>
              </>
            )}
            
            {status === 'failed' && (
              <>
                <AlertCircle className="w-16 h-16 mx-auto text-red-500" />
                <CardTitle className="text-2xl font-bold text-red-700">Donation Failed</CardTitle>
                <CardDescription>
                  We couldn't process your donation. Please try again or contact support.
                </CardDescription>
              </>
            )}
          </CardHeader>

          <CardContent className="space-y-4">
            {status === 'success' && donationAmount && (
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-700 dark:text-green-400">
                  ৳{donationAmount}
                </div>
                <div className="text-sm text-green-600 dark:text-green-300">
                  Donation Amount
                </div>
              </div>
            )}

            {transactionId && (
              <div className="text-sm text-muted-foreground text-center">
                Transaction ID: {transactionId}
              </div>
            )}

            <div className="space-y-2">
              <Button 
                onClick={() => navigate('/')}
                className="w-full"
              >
                {status === 'success' ? 'Explore More Creators' : 'Back to Home'}
              </Button>
              
              {status === 'failed' && (
                <Button 
                  variant="outline" 
                  onClick={() => window.history.back()}
                  className="w-full"
                >
                  Try Again
                </Button>
              )}
            </div>

            {status === 'success' && (
              <div className="text-sm text-muted-foreground text-center pt-4">
                <p>🎉 Your support helps creators continue their amazing work!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationSuccess;