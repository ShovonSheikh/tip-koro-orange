import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Globe, Instagram, Twitter, Facebook, Share2, Loader2 } from "lucide-react";
import { useParams, Link } from "react-router-dom";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useDonations } from "@/hooks/useDonations";

const CreatorProfile = () => {
  const { username } = useParams();
  const { profile, loading: profileLoading, error: profileError } = useUserProfile(username || '');
  const { donations, loading: donationsLoading } = useDonations(profile?.id, 3);

  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  if (profileError || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Creator not found</h1>
          <p className="text-muted-foreground">The creator @{username} doesn't exist or their account is inactive.</p>
          <Button asChild>
            <Link to="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const isActive = profile.subscription_status === 'active';
  const donorCount = donations.length; // This is simplified - in real app would be separate query

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">TipKoro</span>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
              Share
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Creator Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <Card className="border-border/50">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                  <div className="relative">
                    <img 
                      src={profile.profile_image_url || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"} 
                      alt={profile.display_name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                    {isActive && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{profile.display_name}</h1>
                      <p className="text-muted-foreground">@{profile.username}</p>
                    </div>
                    
                    {!isActive && (
                      <Badge variant="destructive">Account Inactive</Badge>
                    )}
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-4 h-4" />
                        <span>Dhaka, Bangladesh</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Bio */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {profile.bio || "This creator hasn't added a bio yet."}
                </p>
              </CardContent>
            </Card>

            {!isActive && (
              <Card className="border-destructive/50 bg-destructive/5">
                <CardContent className="p-6">
                  <div className="text-center space-y-2">
                    <h3 className="font-semibold text-destructive">Account Inactive</h3>
                    <p className="text-sm text-muted-foreground">
                      This creator's subscription has expired. They need to renew their subscription to receive donations.
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Tip Section */}
          <div className="space-y-6">
            {/* Tip Card */}
            <Card className="border-primary/20 shadow-orange">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>Support {profile.display_name}</span>
                </CardTitle>
                <CardDescription>
                  Show your appreciation with a tip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-foreground">৳{profile.current_amount.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">raised from {donorCount} supporters</div>
                  {profile.goal_amount > 0 && (
                    <div className="w-full bg-secondary rounded-full h-2">
                      <div 
                        className="bg-gradient-orange h-2 rounded-full" 
                        style={{ width: `${Math.min((Number(profile.current_amount) / Number(profile.goal_amount)) * 100, 100)}%` }}
                      ></div>
                    </div>
                  )}
                </div>
                
                <Button 
                  variant="tip" 
                  size="lg" 
                  className="w-full" 
                  asChild
                  disabled={!isActive}
                >
                  <Link to={isActive ? `/d/${profile.username}` : '#'}>
                    <Heart className="w-5 h-5" />
                    {isActive ? 'Send a Tip' : 'Account Inactive'}
                  </Link>
                </Button>
                
                <div className="text-xs text-center text-muted-foreground">
                  Minimum tip: ৳10 • Secure payments via RupantorPay
                </div>
              </CardContent>
            </Card>

            {/* Quick Tip Amounts */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Quick Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-3">
                  {[50, 100, 200, 500].map((amount) => (
                    <Button 
                      key={amount} 
                      variant="outline" 
                      size="sm" 
                      asChild 
                      className="hover:bg-primary hover:text-primary-foreground transition-all"
                      disabled={!isActive}
                    >
                      <Link to={isActive ? `/d/${profile.username}?amount=${amount}` : '#'}>
                        ৳{amount}
                      </Link>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Supporters */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg">Recent Supporters</CardTitle>
              </CardHeader>
              <CardContent>
                {donationsLoading ? (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="h-4 w-4 animate-spin" />
                  </div>
                ) : donations.length > 0 ? (
                  <div className="space-y-3">
                    {donations.map((donation) => (
                      <div key={donation.id} className="flex items-center justify-between text-sm">
                        <div>
                          <div className="font-medium text-foreground">
                            {donation.is_anonymous ? "Anonymous" : (donation.donor_name || "Anonymous")}
                          </div>
                          <div className="text-muted-foreground">
                            {new Date(donation.created_at).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="font-bold text-primary">৳{donation.amount}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-4">No supporters yet</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;