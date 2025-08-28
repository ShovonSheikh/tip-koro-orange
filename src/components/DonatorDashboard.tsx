import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  DollarSign, 
  Heart, 
  Settings,
  Crown,
  ArrowRight,
  Calendar,
  TrendingUp
} from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DonatorDashboardProps {
  profile: any;
  username: string;
}

interface MyDonation {
  id: string;
  amount: number;
  message?: string;
  created_at: string;
  creator: {
    username: string;
    display_name: string;
  };
}

export const DonatorDashboard = ({ profile, username }: DonatorDashboardProps) => {
  const [myDonations, setMyDonations] = useState<MyDonation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const { data, error } = await supabase
          .from('donations')
          .select(`
            id,
            amount,
            message,
            created_at,
            creator:users!creator_id(username, display_name)
          `)
          .eq('donor_email', profile.email)
          .eq('payment_status', 'completed')
          .order('created_at', { ascending: false })
          .limit(5);

        if (error) throw error;
        setMyDonations(data || []);
      } catch (error) {
        console.error('Error fetching donations:', error);
      } finally {
        setLoading(false);
      }
    };

    if (profile?.email) {
      fetchMyDonations();
    }
  }, [profile?.email]);

  const totalDonated = myDonations.reduce((sum, donation) => sum + donation.amount, 0);

  return (
    <>
      {/* Upgrade to Creator Alert */}
      <Alert className="mb-6 border-primary/50 bg-primary/10">
        <Crown className="h-4 w-4 text-primary" />
        <AlertDescription className="text-primary">
          Want to receive donations? Upgrade to a creator account and start earning.{' '}
          <Link to={`/a/${username}/subscription`} className="underline font-medium">
            Become a creator
          </Link>
        </AlertDescription>
      </Alert>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Donated</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{totalDonated.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Supporting creators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Creators Supported</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Set(myDonations.map(d => d.creator?.username)).size}
            </div>
            <p className="text-xs text-muted-foreground">
              Unique creators
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Member Since</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
            </div>
            <p className="text-xs text-muted-foreground">
              Part of TipKoro
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>My Recent Donations</CardTitle>
            <CardDescription>Your support for creators</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
              </div>
            ) : myDonations.length > 0 ? (
              <div className="space-y-4">
                {myDonations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {donation.creator?.display_name || 'Unknown Creator'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(donation.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">৳{donation.amount}</p>
                      {donation.message && (
                        <p className="text-sm text-muted-foreground max-w-[150px] truncate">
                          "{donation.message}"
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Heart className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No donations yet</p>
                <p className="text-sm">Start supporting your favorite creators!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
            <CardDescription>Manage your account and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`/a/${username}/profile`}>
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Link>
            </Button>
            
            <Button className="w-full justify-start" variant="default" asChild>
              <Link to={`/a/${username}/subscription`}>
                <Crown className="mr-2 h-4 w-4" />
                Become a Creator
              </Link>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to="/">
                <TrendingUp className="mr-2 h-4 w-4" />
                Discover Creators
              </Link>
            </Button>
            
            <div className="pt-4 border-t">
              <p className="text-sm text-muted-foreground mb-2">Need help?</p>
              <Button className="w-full justify-start" variant="ghost" size="sm">
                <ArrowRight className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
};