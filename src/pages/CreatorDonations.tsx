import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDonations } from "@/hooks/useDonations";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  Users, 
  Calendar,
  MessageSquare,
  User,
  Eye,
  EyeOff
} from "lucide-react";

const CreatorDonations = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(username || '');
  const { donations, loading: donationsLoading } = useDonations(profile?.id);

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span>Loading donations...</span>
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

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const totalDonors = new Set(donations.filter(d => !d.is_anonymous && d.donor_email).map(d => d.donor_email)).size;
  const averageAmount = donations.length > 0 ? totalAmount / donations.length : 0;

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showBreadcrumbs currentPage="Donations" creatorUsername={username} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Donations</h1>
          <p className="text-muted-foreground">
            Track all donations received from your supporters
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{totalAmount.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From {donations.length} donations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Unique Donors</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalDonors}</div>
              <p className="text-xs text-muted-foreground">
                Individual supporters
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Amount</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">৳{averageAmount.toFixed(0)}</div>
              <p className="text-xs text-muted-foreground">
                Per donation
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Donations List */}
        <Card>
          <CardHeader>
            <CardTitle>All Donations</CardTitle>
            <CardDescription>
              Complete history of donations received
            </CardDescription>
          </CardHeader>
          <CardContent>
            {donationsLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
              </div>
            ) : donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div 
                    key={donation.id} 
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        {donation.is_anonymous ? (
                          <EyeOff className="w-5 h-5 text-muted-foreground" />
                        ) : (
                          <User className="w-5 h-5 text-primary" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center space-x-2">
                          <p className="font-medium">
                            {donation.is_anonymous ? 'Anonymous Supporter' : donation.donor_name || 'Unknown'}
                          </p>
                          {donation.is_anonymous && (
                            <Badge variant="secondary" className="text-xs">
                              <EyeOff className="w-3 h-3 mr-1" />
                              Anonymous
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(donation.created_at).toLocaleDateString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-3 h-3" />
                            <span>{new Date(donation.created_at).toLocaleTimeString()}</span>
                          </div>
                        </div>
                        
                        {donation.message && (
                          <div className="mt-2 flex items-start space-x-1">
                            <MessageSquare className="w-3 h-3 mt-0.5 text-muted-foreground" />
                            <p className="text-sm italic text-muted-foreground">
                              "{donation.message}"
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-bold text-primary">
                        ৳{donation.amount.toLocaleString()}
                      </div>
                      <Badge 
                        variant={donation.payment_status === 'completed' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {donation.payment_status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="mx-auto h-12 w-12 text-muted-foreground opacity-50 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">No donations yet</h3>
                <p className="text-muted-foreground">
                  Start sharing your profile to receive your first donation!
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatorDonations;