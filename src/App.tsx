import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import CreatorProfile from "./pages/CreatorProfile";
import DonationPage from "./pages/DonationPage";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import CreatorProfileSettings from "./pages/CreatorProfileSettings";
import CreatorDonations from "./pages/CreatorDonations";
import CreatorSubscription from "./pages/CreatorSubscription";
import CreatorWithdraw from "./pages/CreatorWithdraw";
import SubscriptionSuccess from "./pages/SubscriptionSuccess";
import SubscriptionCancel from "./pages/SubscriptionCancel";
import DonationSuccess from "./pages/DonationSuccess";
import DonationCancel from "./pages/DonationCancel";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/u/:username" element={<CreatorProfile />} />
            <Route path="/d/:username" element={<DonationPage />} />
            <Route path="/a/:username" element={<Dashboard />} />
            <Route path="/dashboard/:username" element={<Dashboard />} />
            <Route path="/a/:username/profile" element={<CreatorProfileSettings />} />
            <Route path="/a/:username/donations" element={<CreatorDonations />} />
            <Route path="/a/:username/subscription" element={<CreatorSubscription />} />
            <Route path="/a/:username/withdraw" element={<CreatorWithdraw />} />
            <Route path="/subscription-success" element={<SubscriptionSuccess />} />
            <Route path="/subscription-cancel" element={<SubscriptionCancel />} />
            <Route path="/donation-success" element={<DonationSuccess />} />
            <Route path="/donation-cancel" element={<DonationCancel />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
