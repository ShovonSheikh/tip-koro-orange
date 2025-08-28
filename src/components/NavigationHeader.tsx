import { Button } from "@/components/ui/button";
import { Heart, User, LogOut, Settings, BarChart3, CreditCard, Banknote, Home } from "lucide-react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUserProfile } from "@/hooks/useUserProfile";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

interface NavigationHeaderProps {
  showBreadcrumbs?: boolean;
  currentPage?: string;
  creatorUsername?: string;
}

export const NavigationHeader = ({ showBreadcrumbs, currentPage, creatorUsername }: NavigationHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [userUsername, setUserUsername] = useState<string>('');
  
  // Get user profile from database
  const { profile } = useUserProfile(userUsername);

  useEffect(() => {
    const getUserUsername = async () => {
      if (user) {
        const { data } = await supabase.from('users').select('username').eq('id', user.id).single();
        setUserUsername(data?.username || '');
      }
    };
    getUserUsername();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const getInitials = (email: string) => {
    return email.split('@')[0].slice(0, 2).toUpperCase();
  };

  const isCreatorDashboard = location.pathname.startsWith('/a/');
  const isDashboardOwner = user?.user_metadata?.username === creatorUsername;

  return (
    <header className="border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 bg-gradient-orange rounded-lg flex items-center justify-center">
            <Heart className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-foreground">TipKoro</span>
        </Link>

        {/* Breadcrumbs for Creator Dashboard */}
        {showBreadcrumbs && isCreatorDashboard && (
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Home className="w-4 h-4" />
            <span>/</span>
            <Link to={`/a/${creatorUsername}`} className="hover:text-foreground transition-colors">
              Dashboard
            </Link>
            {currentPage && (
              <>
                <span>/</span>
                <span className="text-foreground font-medium">{currentPage}</span>
              </>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Creator Dashboard Link - only show if user is a creator and not already on dashboard */}
              {profile && !isCreatorDashboard && (
                <Button variant="ghost" size="sm" asChild>
                         <Link to={`/a/${userUsername}`}>
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
              )}

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.profile_image_url} alt={user.email || ''} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {getInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {profile?.display_name || 'User'}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {/* Creator Dashboard Links - only show if user is a creator */}
                  {profile && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to={`/a/${userUsername}`}>
                          <BarChart3 className="mr-2 h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/a/${userUsername}/profile`}>
                          <Settings className="mr-2 h-4 w-4" />
                          <span>Profile Settings</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/a/${userUsername}/donations`}>
                          <CreditCard className="mr-2 h-4 w-4" />
                          <span>Donations</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/a/${userUsername}/subscription`}>
                          <User className="mr-2 h-4 w-4" />
                          <span>Subscription</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to={`/a/${userUsername}/withdraw`}>
                          <Banknote className="mr-2 h-4 w-4" />
                          <span>Withdraw</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                    </>
                  )}
                  
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
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
    </header>
  );
};