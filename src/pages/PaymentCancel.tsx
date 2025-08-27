import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle } from 'lucide-react';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">Payment Cancelled</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <XCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-yellow-700 mb-2">Payment Cancelled</h2>
            <p className="text-muted-foreground mb-4">
              Your payment was cancelled. No charges have been made to your account.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Button asChild>
                <Link to="/">Go Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link to="/creator-subscription">Try Again</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}