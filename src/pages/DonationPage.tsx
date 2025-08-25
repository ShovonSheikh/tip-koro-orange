import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, ArrowLeft, DollarSign, CreditCard, Smartphone } from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";

const DonationPage = () => {
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const prefilledAmount = searchParams.get('amount');
  
  const [amount, setAmount] = useState(prefilledAmount || '');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);

  // Mock creator data
  const creator = {
    username: username || "creator",
    displayName: "Amazing Creator",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    isActive: true
  };

  const quickAmounts = [50, 100, 200, 500, 1000];

  const handleAmountSelect = (selectedAmount: number) => {
    setAmount(selectedAmount.toString());
  };

  const handleDonate = () => {
    if (!amount || parseInt(amount) < 10) {
      alert('Minimum donation amount is ৳10');
      return;
    }
    
    // In a real app, this would integrate with RupantorPay
    console.log('Processing donation:', {
      creator: creator.username,
      amount: parseInt(amount),
      donorName: isAnonymous ? null : donorName,
      donorEmail: isAnonymous ? null : donorEmail,
      message
    });
    
    alert('This would redirect to RupantorPay for payment processing!');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm" asChild>
              <a href={`/u/${creator.username}`}>
                <ArrowLeft className="w-4 h-4" />
                Back to Profile
              </a>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">TipKoro</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          {/* Creator Info */}
          <Card className="border-border/50">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <img 
                    src={creator.avatar} 
                    alt={creator.displayName}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  {creator.isActive && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background"></div>
                  )}
                </div>
                <div>
                  <h1 className="text-xl font-bold text-foreground">{creator.displayName}</h1>
                  <p className="text-muted-foreground">@{creator.username}</p>
                  <Badge variant="secondary" className="mt-1">Active Creator</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Donation Form */}
          <Card className="border-primary/20 shadow-orange">
            <CardHeader className="text-center">
              <CardTitle className="flex items-center justify-center space-x-2">
                <Heart className="w-6 h-6 text-primary" />
                <span>Support {creator.displayName}</span>
              </CardTitle>
              <CardDescription>
                Show your appreciation with a tip (minimum ৳10)
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Amount Selection */}
              <div className="space-y-4">
                <Label htmlFor="amount" className="text-lg font-semibold">Tip Amount</Label>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                  {quickAmounts.map((quickAmount) => (
                    <Button
                      key={quickAmount}
                      variant={amount === quickAmount.toString() ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleAmountSelect(quickAmount)}
                      className="h-12"
                    >
                      ৳{quickAmount}
                    </Button>
                  ))}
                </div>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="Enter custom amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-10 text-lg font-semibold"
                    min="10"
                  />
                </div>
                {amount && parseInt(amount) >= 10 && (
                  <div className="text-center p-3 bg-accent/20 rounded-lg">
                    <div className="text-2xl font-bold text-primary">৳{parseInt(amount).toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground">Your generous tip</div>
                  </div>
                )}
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Message (Optional)</Label>
                <Textarea
                  id="message"
                  placeholder="Leave a message of support..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                />
              </div>

              {/* Donor Information */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Your Information</Label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="anonymous"
                      checked={isAnonymous}
                      onChange={(e) => setIsAnonymous(e.target.checked)}
                      className="rounded border-border"
                    />
                    <Label htmlFor="anonymous" className="text-sm">Tip anonymously</Label>
                  </div>
                </div>
                
                {!isAnonymous && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="donorName">Your Name</Label>
                      <Input
                        id="donorName"
                        placeholder="Enter your name"
                        value={donorName}
                        onChange={(e) => setDonorName(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="donorEmail">Email (Optional)</Label>
                      <Input
                        id="donorEmail"
                        type="email"
                        placeholder="your@email.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Payment Button */}
              <div className="space-y-4">
                <Button 
                  variant="tip" 
                  size="lg" 
                  className="w-full text-lg h-14"
                  onClick={handleDonate}
                  disabled={!amount || parseInt(amount) < 10}
                >
                  <CreditCard className="w-5 h-5" />
                  Pay ৳{amount ? parseInt(amount).toLocaleString() : '0'} via RupantorPay
                </Button>
                
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Smartphone className="w-4 h-4" />
                      <span>bKash</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Smartphone className="w-4 h-4" />
                      <span>Nagad</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <CreditCard className="w-4 h-4" />
                      <span>Bank Card</span>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Secure payment processing • SSL encrypted • 100% safe
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="border-border/50 bg-accent/10">
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                <Heart className="w-5 h-5 text-primary mt-0.5" />
                <div className="text-sm space-y-1">
                  <p className="font-medium text-foreground">How TipKoro Works</p>
                  <p className="text-muted-foreground">
                    Your tip goes directly to {creator.displayName}. They can withdraw earnings anytime or receive automatic monthly payouts.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DonationPage;