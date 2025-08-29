import { useNavigate } from 'react-router-dom';
import { XCircle, ArrowLeft, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const DonationCancel = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/10 p-4">
      <div className="container mx-auto max-w-md pt-20">
        <Card className="border-0 shadow-xl bg-card/80 backdrop-blur-sm">
          <CardHeader className="text-center">
            <div className="relative">
              <XCircle className="w-16 h-16 mx-auto text-orange-500" />
              <Heart className="w-6 h-6 absolute top-0 right-[calc(50%-20px)] text-gray-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-orange-700">Donation Cancelled</CardTitle>
            <CardDescription>
              Your donation was cancelled. You can support the creator anytime!
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Button 
                onClick={() => window.history.back()}
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
                Browse Creators
              </Button>
            </div>

            <div className="text-sm text-muted-foreground text-center pt-4">
              <p>💡 Every donation, no matter how small, makes a difference!</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DonationCancel;