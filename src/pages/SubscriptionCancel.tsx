import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const SubscriptionCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-md pt-20">
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <XCircle className="w-16 h-16 mx-auto text-orange-500" />
            <CardTitle className="text-2xl font-bold text-orange-700">Payment Cancelled</CardTitle>
            <CardDescription>
              Your subscription payment was cancelled. You can try again anytime.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
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
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center pt-4">
              <p>Need help? Contact our support team.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SubscriptionCancel;