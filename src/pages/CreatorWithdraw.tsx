import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserProfile } from "@/hooks/useUserProfile";
import { NavigationHeader } from "@/components/NavigationHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { 
  Banknote, 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  DollarSign,
  Info,
  Loader2
} from "lucide-react";

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  created_at: string;
  processed_at?: string;
  bank_name: string;
  bank_account_name: string;
  bank_account_number: string;
}

const CreatorWithdraw = () => {
  const { username } = useParams<{ username: string }>();
  const { user, loading: authLoading } = useAuth();
  const { profile, loading: profileLoading } = useUserProfile(username || '');
  
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingWithdrawals, setLoadingWithdrawals] = useState(true);
  const [formData, setFormData] = useState({
    amount: '',
    bank_name: '',
    bank_account_name: '',
    bank_account_number: '',
  });

  useEffect(() => {
    if (profile) {
      fetchWithdrawals();
    }
  }, [profile]);

  const fetchWithdrawals = async () => {
    try {
      const { data, error } = await supabase
        .from('withdrawals')
        .select('*')
        .eq('user_id', profile?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setWithdrawals(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load withdrawal history",
        variant: "destructive",
      });
    } finally {
      setLoadingWithdrawals(false);
    }
  };

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
          <span>Loading withdrawal...</span>
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const amount = parseFloat(formData.amount);
    
    if (amount < 100) {
      toast({
        title: "Invalid Amount",
        description: "Minimum withdrawal amount is ৳100",
        variant: "destructive",
      });
      return;
    }
    
    if (amount > profile.current_amount) {
      toast({
        title: "Insufficient Balance",
        description: "You don't have enough balance for this withdrawal",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('withdrawals')
        .insert({
          user_id: profile.id,
          amount: amount,
          bank_name: formData.bank_name,
          bank_account_name: formData.bank_account_name,
          bank_account_number: formData.bank_account_number,
          status: 'pending'
        });

      if (error) throw error;

      toast({
        title: "Withdrawal Requested",
        description: "Your withdrawal request has been submitted. Processing takes 7-10 business days.",
      });
      
      setFormData({
        amount: '',
        bank_name: '',
        bank_account_name: '',
        bank_account_number: '',
      });
      
      fetchWithdrawals();
    } catch (error: any) {
      toast({
        title: "Request Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary"><Clock className="w-3 h-3 mr-1" />Pending</Badge>;
      case 'processing':
        return <Badge variant="default"><Clock className="w-3 h-3 mr-1" />Processing</Badge>;
      case 'completed':
        return <Badge variant="default" className="bg-green-500"><CheckCircle className="w-3 h-3 mr-1" />Completed</Badge>;
      case 'failed':
        return <Badge variant="destructive"><AlertCircle className="w-3 h-3 mr-1" />Failed</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationHeader showBreadcrumbs currentPage="Withdraw" creatorUsername={username} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Withdraw Funds</h1>
          <p className="text-muted-foreground">
            Request withdrawal of your earned donations
          </p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <DollarSign className="mr-2 h-5 w-5" />
              Available Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary mb-2">
              ৳{profile.current_amount.toLocaleString()}
            </div>
            <p className="text-muted-foreground">
              Minimum withdrawal amount: ৳100
            </p>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Withdrawal Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Banknote className="mr-2 h-5 w-5" />
                Request Withdrawal
              </CardTitle>
              <CardDescription>
                Submit a new withdrawal request
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Alert className="mb-6">
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>Processing Time:</strong> Withdrawals take 7-10 business days to process. 
                  This is not instant like some other platforms show - we ensure secure bank transfers.
                </AlertDescription>
              </Alert>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Amount (BDT)</Label>
                  <Input
                    id="amount"
                    type="number"
                    min="100"
                    max={profile.current_amount}
                    step="1"
                    placeholder="1000"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_name">Bank Name</Label>
                  <Input
                    id="bank_name"
                    placeholder="e.g., Dutch Bangla Bank"
                    value={formData.bank_name}
                    onChange={(e) => setFormData({ ...formData, bank_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_account_name">Account Holder Name</Label>
                  <Input
                    id="bank_account_name"
                    placeholder="Full name as per bank account"
                    value={formData.bank_account_name}
                    onChange={(e) => setFormData({ ...formData, bank_account_name: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bank_account_number">Account Number</Label>
                  <Input
                    id="bank_account_number"
                    placeholder="Bank account number"
                    value={formData.bank_account_number}
                    onChange={(e) => setFormData({ ...formData, bank_account_number: e.target.value })}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={isLoading || profile.current_amount < 100}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Request Withdrawal
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Withdrawal History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5" />
                Withdrawal History
              </CardTitle>
              <CardDescription>
                Your recent withdrawal requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loadingWithdrawals ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-primary border-t-transparent animate-spin rounded-full"></div>
                </div>
              ) : withdrawals.length > 0 ? (
                <div className="space-y-4">
                  {withdrawals.map((withdrawal) => (
                    <div key={withdrawal.id} className="p-4 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">৳{withdrawal.amount.toLocaleString()}</div>
                        {getStatusBadge(withdrawal.status)}
                      </div>
                      
                      <div className="text-sm text-muted-foreground space-y-1">
                        <div className="flex justify-between">
                          <span>Bank:</span>
                          <span>{withdrawal.bank_name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Requested:</span>
                          <span>{new Date(withdrawal.created_at).toLocaleDateString()}</span>
                        </div>
                        {withdrawal.processed_at && (
                          <div className="flex justify-between">
                            <span>Processed:</span>
                            <span>{new Date(withdrawal.processed_at).toLocaleDateString()}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Banknote className="mx-auto h-12 w-12 opacity-50 mb-2" />
                  <p>No withdrawal requests yet</p>
                  <p className="text-sm">Your withdrawal history will appear here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CreatorWithdraw;