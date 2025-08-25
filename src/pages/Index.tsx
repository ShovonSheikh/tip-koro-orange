import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Zap, Shield, DollarSign, Users, Smartphone, User, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const { user, signOut, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span>Loading...</span>
        </div>
      </div>
    );
  }
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
            {user ? (
              <>
                <div className="flex items-center space-x-2 text-sm">
                  <User className="w-4 h-4" />
                  <span>{user.email}</span>
                </div>
                <Button variant="ghost" size="sm" onClick={signOut}>
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="sm" asChild>
                  <Link to="/auth">Sign In</Link>
                </Button>
                <Button variant="tip" size="sm" asChild>
                  <Link to="/auth">Get Started</Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                  Support Your
                  <span className="bg-gradient-hero bg-clip-text text-transparent"> Favorite </span>
                  Creators
                </h1>
                <p className="text-xl text-muted-foreground max-w-2xl">
                  TipKoro connects fans with creators in Bangladesh. Send tips, show appreciation, and help creators thrive in the digital economy.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="text-lg px-8" asChild>
                  <Link to="/u/creator">
                    <Heart className="w-5 h-5" />
                    Support a Creator
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="text-lg px-8" asChild>
                  <Link to={user ? "/dashboard" : "/auth"}>
                    <Users className="w-5 h-5" />
                    {user ? "My Dashboard" : "Become a Creator"}
                  </Link>
                </Button>
              </div>
              <div className="flex items-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4 text-primary" />
                  <span>Secure Payments</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4 text-primary" />
                  <span>Instant Transfer</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-orange opacity-20 rounded-3xl blur-3xl"></div>
              <img 
                src={heroImage} 
                alt="People supporting creators through digital donations"
                className="relative z-10 w-full h-auto rounded-3xl shadow-glow"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              Why Choose TipKoro?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Built for the Bangladeshi creator economy with local payment solutions
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-border/50 shadow-sm hover:shadow-orange transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <DollarSign className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Local Payment Gateway</CardTitle>
                <CardDescription>
                  Integrated with RupantorPay for seamless BDT transactions. Support bKash, Nagad, and bank transfers.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-orange transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Mobile-First Design</CardTitle>
                <CardDescription>
                  Optimized for mobile users in Bangladesh. Quick and easy tipping from any device.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-orange transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Creator Dashboard</CardTitle>
                <CardDescription>
                  Comprehensive analytics, donation tracking, and withdrawal management all in one place.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-orange transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Secure & Reliable</CardTitle>
                <CardDescription>
                  Enterprise-grade security with transparent fee structure. Your money is always safe.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-orange transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Instant Withdrawals</CardTitle>
                <CardDescription>
                  Request withdrawals anytime or get automatic monthly payouts. Your earnings, your choice.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="border-border/50 shadow-sm hover:shadow-orange transition-all duration-300">
              <CardHeader>
                <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center mb-4">
                  <Heart className="w-6 h-6 text-accent-foreground" />
                </div>
                <CardTitle>Community Focused</CardTitle>
                <CardDescription>
                  Built specifically for Bangladeshi creators and supporters. Local support, global reach.
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
              How TipKoro Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start supporting creators or earning as a creator
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* For Supporters */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground">For Supporters</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Find a Creator</h4>
                    <p className="text-muted-foreground">Visit any creator's TipKoro profile using their unique link</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Choose Amount</h4>
                    <p className="text-muted-foreground">Select any amount (minimum 10 BDT) and add an optional message</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Pay Securely</h4>
                    <p className="text-muted-foreground">Complete payment through RupantorPay with your preferred method</p>
                  </div>
                </div>
              </div>
            </div>

            {/* For Creators */}
            <div className="space-y-8">
              <h3 className="text-2xl font-bold text-foreground">For Creators</h3>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">1</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Create Account</h4>
                    <p className="text-muted-foreground">Sign up and pay the monthly 100 BDT subscription fee</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">2</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Setup Profile</h4>
                    <p className="text-muted-foreground">Add your bio, profile picture, and social media links</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">3</div>
                  <div>
                    <h4 className="font-semibold text-foreground">Start Earning</h4>
                    <p className="text-muted-foreground">Share your link and receive tips from your supporters</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-3xl lg:text-4xl font-bold text-white">
                Ready to Start Your Creator Journey?
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto">
                Join hundreds of creators already earning through TipKoro. Start building your supporter community today.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg" className="text-lg px-8">
                <Users className="w-5 h-5" />
                Create Account
              </Button>
              <Button variant="outline" size="lg" className="text-lg px-8 bg-white/10 border-white/20 text-white hover:bg-white hover:text-primary">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-secondary/30">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center">
                  <Heart className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-foreground">TipKoro</span>
              </div>
              <p className="text-muted-foreground">
                Empowering Bangladeshi creators through digital tips and community support.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Platform</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">How it Works</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Creator Guide</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Community</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold text-foreground">Legal</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cookie Policy</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border pt-8 mt-8 text-center text-muted-foreground">
            <p>&copy; 2024 TipKoro. All rights reserved. Made with ❤️ in Bangladesh.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;