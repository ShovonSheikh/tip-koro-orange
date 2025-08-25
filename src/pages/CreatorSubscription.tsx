import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle,
  AlertCircle,
  Clock,
  Zap,
  Shield,
  Users
} from "lucide-react";

const CreatorSubscription = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(username || '');

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span>Loading subscription...</span>
        </div>
      </div>
    );
  }

  // Check if user owns this dashboard
  if (!user || user.user_metadata?.username !== username) {
    return <Navigate to="/auth" replace />;
  }

  if (!profile) {
    return <Navigate to="/" replace />;
  }

  const isActive = profile.subscription_status === 'active';
  const expiresAt = profile.subscription_expires_at ? new Date(profile.subscription_expires_at) : null;
  const daysUntilExpiry = expiresAt 
    ? Math.ceil((expiresAt.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  const handleSubscriptionAction = () => {
    // In a real app, this would integrate with RupantorPay or other payment gateway
    alert('Payment integration would be implemented here with RupantorPay or similar service');
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showBreadcrumbs currentPage="Subscription" creatorUsername={username} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Subscription Management</h1>
          <p className="text-muted-foreground">
            Manage your TipKoro creator subscription to keep receiving donations
          </p>
        </div>

        {/* Current Status */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <CreditCard className="mr-2 h-5 w-5" />
                Current Subscription Status
              </div>
              <Badge variant={isActive ? "default" : "destructive"} className="flex items-center">
                {isActive ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Active
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-3 h-3 mr-1" />
                    Inactive
                  </>
                )}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isActive ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Current Plan:</span>
                  <span className="font-medium">Creator Monthly - ৳100/month</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Next Billing Date:</span>
                  <span className="font-medium">
                    {expiresAt?.toLocaleDateString()} ({daysUntilExpiry} days)
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Auto-Renewal:</span>
                  <span className="font-medium text-green-600">Enabled</span>
                </div>
                
                {daysUntilExpiry <= 7 && daysUntilExpiry > 0 && (
                  <Alert className="border-orange-500/50 bg-orange-500/10">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <AlertDescription className="text-orange-700 dark:text-orange-300">
                      Your subscription expires in {daysUntilExpiry} days. Make sure your payment method is up to date.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <Alert className="border-destructive/50 bg-destructive/10">
                  <AlertCircle className="h-4 w-4 text-destructive" />
                  <AlertDescription className="text-destructive">
                    Your subscription is inactive. You cannot receive donations until you activate your subscription.
                  </AlertDescription>
                </Alert>
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">What happens when subscription is inactive:</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Your donation page shows as "inactive"</li>
                    <li>• Supporters cannot send you donations</li>
                    <li>• Your profile remains visible but non-functional</li>
                    <li>• You keep access to your dashboard and settings</li>
                  </ul>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Plans */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Creator Plan */}
          <Card className={`relative ${isActive ? 'ring-2 ring-primary' : ''}`}>
            {isActive && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <Badge className="bg-primary text-primary-foreground">Current Plan</Badge>
              </div>
            )}
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Creator Monthly
              </CardTitle>
              <CardDescription>Everything you need to receive donations</CardDescription>
              <div className="text-3xl font-bold">৳100<span className="text-base text-muted-foreground">/month</span></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Unlimited donations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Custom profile page</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Analytics dashboard</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Weekly withdrawal option</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-sm">Customer support</span>
                </div>
              </div>
              
              <Button 
                className="w-full" 
                onClick={handleSubscriptionAction}
                variant={isActive ? "outline" : "default"}
              >
                {isActive ? "Manage Billing" : "Subscribe Now"}
              </Button>
            </CardContent>
          </Card>

          {/* Features Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                Why Subscribe?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <Zap className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Start Earning Immediately</h4>
                    <p className="text-sm text-muted-foreground">
                      Activate your profile and start receiving donations from day one
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Secure Payments</h4>
                    <p className="text-sm text-muted-foreground">
                      All donations processed through secure payment gateways
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Users className="w-5 h-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-medium">Build Your Community</h4>
                    <p className="text-sm text-muted-foreground">
                      Connect with supporters and grow your creator community
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Billing History */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="mr-2 h-5 w-5" />
              Billing History
            </CardTitle>
            <CardDescription>Your recent subscription payments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <Calendar className="mx-auto h-12 w-12 opacity-50 mb-2" />
              <p>No billing history available</p>
              <p className="text-sm">Billing records will appear here after your first payment</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorSubscription;