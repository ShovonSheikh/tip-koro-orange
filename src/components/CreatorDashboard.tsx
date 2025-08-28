import { useDonations } from "@/hooks/useDonations";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  DollarSign, 
  Users, 
  Calendar, 
  TrendingUp, 
  Clock,
  AlertCircle,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreatorDashboardProps {
  profile: any;
  username: string;
}

export const CreatorDashboard = ({ profile, username }: CreatorDashboardProps) => {
  const { donations, loading: donationsLoading } = useDonations(profile?.id, 5);

  const totalDonations = donations.reduce((sum, donation) => sum + donation.amount, 0);
  const goalProgress = profile.goal_amount > 0 ? (profile.current_amount / profile.goal_amount) * 100 : 0;
  const isActive = profile.subscription_status === 'active';
  const daysUntilExpiry = profile.subscription_expires_at 
    ? Math.ceil((new Date(profile.subscription_expires_at).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  return (
    <>
      {/* Subscription Status Alert */}
      {!isActive && (
        <Alert className="mb-6 border-destructive/50 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive">
            Your subscription is inactive. Activate it to start receiving donations.{' '}
            <Link to={`/a/${username}/subscription`} className="underline font-medium">
              Manage subscription
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {isActive && daysUntilExpiry <= 7 && (
        <Alert className="mb-6 border-orange-500/50 bg-orange-500/10">
          <Clock className="h-4 w-4 text-orange-500" />
          <AlertDescription className="text-orange-700 dark:text-orange-300">
            Your subscription expires in {daysUntilExpiry} days.{' '}
            <Link to={`/a/${username}/subscription`} className="underline font-medium">
              Renew now
            </Link>
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">৳{profile.current_amount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Available for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Supporters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{donations.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent supporters
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Goal Progress</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalProgress.toFixed(0)}%</div>
            <Progress value={goalProgress} className="h-2 mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              ৳{profile.current_amount} of ৳{profile.goal_amount}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Subscription</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Badge variant={isActive ? "default" : "destructive"}>
                {isActive ? "Active" : "Inactive"}
              </Badge>
              {isActive && <CheckCircle className="h-4 w-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {isActive 
                ? `Expires ${profile.subscription_expires_at ? new Date(profile.subscription_expires_at).toLocaleDateString() : 'Soon'}`
                : 'Renew to activate'
              }
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Donations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Donations</CardTitle>
              <CardDescription>Your latest supporters</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link to={`/a/${username}/donations`}>
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            {donationsLoading ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
              </div>
            ) : donations.length > 0 ? (
              <div className="space-y-4">
                {donations.map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">
                        {donation.is_anonymous ? 'Anonymous' : donation.donor_name || 'Anonymous'}
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
                <Users className="mx-auto h-12 w-12 opacity-50 mb-2" />
                <p>No donations yet</p>
                <p className="text-sm">Share your profile to get started!</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your creator profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`/a/${username}/profile`}>
                <Users className="mr-2 h-4 w-4" />
                Edit Profile & Settings
              </Link>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`/a/${username}/donations`}>
                <DollarSign className="mr-2 h-4 w-4" />
                View All Donations
              </Link>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`/a/${username}/withdraw`}>
                <TrendingUp className="mr-2 h-4 w-4" />
                Request Withdrawal
              </Link>
            </Button>
            
            <Button className="w-full justify-start" variant="outline" asChild>
              <Link to={`/u/${username}`} target="_blank">
                <ArrowRight className="mr-2 h-4 w-4" />
                View Public Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </>
  );
};