import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Globe, Instagram, Twitter, Facebook, Share2 } from "lucide-react";
import { useParams } from "react-router-dom";

const CreatorProfile = () => {
  const { username } = useParams();

  // Mock creator data - in real app, this would come from API
  const creator = {
    username: username || "creator",
    displayName: "Amazing Creator",
    bio: "Content creator passionate about technology, photography, and sharing knowledge with the community. Building amazing digital experiences every day.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    location: "Dhaka, Bangladesh",
    website: "https://example.com",
    socialLinks: {
      instagram: "@creator",
      twitter: "@creator",
      facebook: "creator"
    },
    totalSupported: 1250,
    supporterCount: 89,
    isActive: true,
    categories: ["Technology", "Photography", "Education"]
  };

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
                      src={creator.avatar} 
                      alt={creator.displayName}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary/20"
                    />
                    {creator.isActive && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  
                  <div className="flex-1 space-y-3">
                    <div>
                      <h1 className="text-2xl font-bold text-foreground">{creator.displayName}</h1>
                      <p className="text-muted-foreground">@{creator.username}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                      {creator.categories.map((category) => (
                        <Badge key={category} variant="secondary">
                          {category}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      {creator.location && (
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-4 h-4" />
                          <span>{creator.location}</span>
                        </div>
                      )}
                      {creator.website && (
                        <div className="flex items-center space-x-1">
                          <Globe className="w-4 h-4" />
                          <a href={creator.website} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                            Website
                          </a>
                        </div>
                      )}
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
                <p className="text-muted-foreground leading-relaxed">{creator.bio}</p>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle>Connect</CardTitle>
                <CardDescription>Follow on social media</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4">
                  {creator.socialLinks.instagram && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://instagram.com/${creator.socialLinks.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        <Instagram className="w-4 h-4" />
                        Instagram
                      </a>
                    </Button>
                  )}
                  {creator.socialLinks.twitter && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://twitter.com/${creator.socialLinks.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                        <Twitter className="w-4 h-4" />
                        Twitter
                      </a>
                    </Button>
                  )}
                  {creator.socialLinks.facebook && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={`https://facebook.com/${creator.socialLinks.facebook}`} target="_blank" rel="noopener noreferrer">
                        <Facebook className="w-4 h-4" />
                        Facebook
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tip Section */}
          <div className="space-y-6">
            {/* Tip Card */}
            <Card className="border-primary/20 shadow-orange">
              <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center space-x-2">
                  <Heart className="w-5 h-5 text-primary" />
                  <span>Support {creator.displayName}</span>
                </CardTitle>
                <CardDescription>
                  Show your appreciation with a tip
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center space-y-2">
                  <div className="text-2xl font-bold text-foreground">৳{creator.totalSupported.toLocaleString()}</div>
                  <div className="text-sm text-muted-foreground">raised from {creator.supporterCount} supporters</div>
                </div>
                
                <Button variant="tip" size="lg" className="w-full" asChild>
                  <a href={`/d/${creator.username}`}>
                    <Heart className="w-5 h-5" />
                    Send a Tip
                  </a>
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
                    <Button key={amount} variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground transition-all">
                      <a href={`/d/${creator.username}?amount=${amount}`}>
                        ৳{amount}
                      </a>
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
                <div className="space-y-3">
                  {[
                    { name: "Anonymous", amount: 100, time: "2 hours ago" },
                    { name: "Ahmed Hassan", amount: 250, time: "1 day ago" },
                    { name: "Fatima Khan", amount: 50, time: "3 days ago" },
                  ].map((supporter, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <div>
                        <div className="font-medium text-foreground">{supporter.name}</div>
                        <div className="text-muted-foreground">{supporter.time}</div>
                      </div>
                      <div className="font-bold text-primary">৳{supporter.amount}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfile;