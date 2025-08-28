import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDonations } from "@/hooks/useDonations";
import { NavigationHeader } from "@/components/NavigationHeader";
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
  ArrowRight,
  Settings,
  Crown
} from "lucide-react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DonatorDashboard } from "@/components/DonatorDashboard";
import { CreatorDashboard } from "@/components/CreatorDashboard";

const Dashboard = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(username || '');

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  // Check if profile exists
  if (!profile) {
    return <Navigate to="/" replace />;
  }

  // Check if user owns this dashboard (compare with database username, not metadata)
  if (profile.id !== user.id) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showBreadcrumbs currentPage="Overview" creatorUsername={username} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {profile.display_name}!
          </h1>
          <p className="text-muted-foreground flex items-center gap-2">
            <Badge variant={profile.role === 'creator' ? 'default' : 'secondary'}>
              {profile.role === 'creator' ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  Creator
                </>
              ) : (
                <>
                  <Users className="w-3 h-3 mr-1" />
                  Supporter
                </>
              )}
            </Badge>
            {profile.role === 'creator' 
              ? "Here's how your creator profile is performing" 
              : "Here's your account overview and donation activity"
            }
          </p>
        </div>

        {/* Role-based Dashboard Content */}
        {profile.role === 'creator' ? (
          <CreatorDashboard profile={profile} username={username || ''} />
        ) : (
          <DonatorDashboard profile={profile} username={username || ''} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;