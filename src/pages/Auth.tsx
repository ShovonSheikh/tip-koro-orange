import React, { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { Heart, Loader2, Users, DollarSign, Shield, Zap, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({ 
    email: '', 
    password: '', 
    username: '', 
    displayName: '',
    isCreator: false 
  });
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Get user profile to redirect to dashboard
      const getUserProfile = async () => {
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', user.id)
          .single();
          
        if (userData?.username) {
          navigate(`/a/${userData.username}`);
        } else {
          navigate('/');
        }
      };
      
      getUserProfile();
    }
  }, [user, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(loginForm.email, loginForm.password);
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        // Get user profile to redirect to dashboard
        const { data: userData } = await supabase
          .from('users')
          .select('username')
          .eq('id', user?.id)
          .single();
          
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
        });
        
        if (userData?.username) {
          navigate(`/a/${userData.username}`);
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signUp(
        signupForm.email, 
        signupForm.password,
        {
          username: signupForm.username,
          display_name: signupForm.displayName,
          role: signupForm.isCreator ? 'creator' : 'donator'
        }
      );
      
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Account created!",
          description: "Please check your email to verify your account.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20 flex">
      {/* Left Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 mb-12 group">
            <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
              <Heart className="w-7 h-7 text-white" />
            </div>
            <span className="text-3xl font-bold text-white">TipKoro</span>
          </Link>

          {/* Hero Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Join the Creator
                <br />
                Economy in 
                <br />
                <span className="text-white/90">Bangladesh</span>
              </h1>
              <p className="text-xl text-white/80 max-w-md">
                Connect with supporters, receive donations, and build your community on Bangladesh's premier creator platform.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4" />
                </div>
                <span>Local payments with bKash, Nagad & banks</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <span>Secure & transparent fee structure</span>
              </div>
              <div className="flex items-center space-x-3 text-white/90">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <span>Weekly withdrawals to your bank</span>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">1000+</div>
                <div className="text-white/70 text-sm">Active Creators</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                <div className="text-2xl font-bold text-white">৳50L+</div>
                <div className="text-white/70 text-sm">Tips Processed</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Auth Forms */}
      <div className="flex-1 lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center">
            <Link to="/" className="inline-flex items-center space-x-2 group">
              <div className="w-10 h-10 bg-gradient-orange rounded-lg flex items-center justify-center group-hover:shadow-glow transition-all">
                <Heart className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold text-foreground">TipKoro</span>
            </Link>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="login" className="text-base">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="text-base">Get Started</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
                <p className="text-muted-foreground">Continue your creator journey</p>
              </div>

              <Card className="border-border/50 shadow-lg">
                <CardContent className="pt-6">
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="login-email" className="text-base">Email address</Label>
                      <Input
                        id="login-email"
                        type="email"
                        placeholder="creator@example.com"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                        className="h-11"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="login-password" className="text-base">Password</Label>
                      <Input
                        id="login-password"
                        type="password"
                        placeholder="Enter your password"
                        value={loginForm.password}
                        onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                        className="h-11"
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Sign In
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold text-foreground">Start earning today</h2>
                <p className="text-muted-foreground">Join thousands of creators in Bangladesh</p>
              </div>

              <Card className="border-border/50 shadow-lg">
                <CardContent className="pt-6">
                  <form onSubmit={handleSignup} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="signup-username" className="text-base">Username</Label>
                        <Input
                          id="signup-username"
                          type="text"
                          placeholder="your-username"
                          value={signupForm.username}
                          onChange={(e) => setSignupForm({ ...signupForm, username: e.target.value })}
                          className="h-11"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="signup-displayname" className="text-base">Display Name</Label>
                        <Input
                          id="signup-displayname"
                          type="text"
                          placeholder="Your Name"
                          value={signupForm.displayName}
                          onChange={(e) => setSignupForm({ ...signupForm, displayName: e.target.value })}
                          className="h-11"
                          required
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-base">Email address</Label>
                      <Input
                        id="signup-email"
                        type="email"
                        placeholder="creator@example.com"
                        value={signupForm.email}
                        onChange={(e) => setSignupForm({ ...signupForm, email: e.target.value })}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-base">Password</Label>
                      <Input
                        id="signup-password"
                        type="password"
                        placeholder="Create a strong password"
                        value={signupForm.password}
                        onChange={(e) => setSignupForm({ ...signupForm, password: e.target.value })}
                        className="h-11"
                        required
                      />
                    </div>

                    <div className="flex items-center space-x-3 p-4 bg-accent/30 rounded-lg border border-primary/20">
                      <Checkbox
                        id="signup-creator"
                        checked={signupForm.isCreator}
                        onCheckedChange={(checked) => setSignupForm({ ...signupForm, isCreator: !!checked })}
                      />
                      <div className="flex-1">
                        <Label htmlFor="signup-creator" className="text-sm font-medium cursor-pointer">
                          I want to be a creator
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Requires ৳100/month subscription to receive donations
                        </p>
                      </div>
                      <Users className="w-5 h-5 text-primary" />
                    </div>

                    <Button type="submit" className="w-full h-11 text-base" disabled={isLoading}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Create Account
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>

                    <p className="text-xs text-muted-foreground text-center">
                      By creating an account, you agree to our{' '}
                      <a href="#" className="text-primary hover:underline">Terms of Service</a>
                      {' '}and{' '}
                      <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                    </p>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Back to Home */}
          <div className="text-center">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
              ← Back to TipKoro
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;