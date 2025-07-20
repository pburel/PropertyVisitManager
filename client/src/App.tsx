import { Switch, Route, Redirect } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/lib/auth";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Dashboard from "@/pages/dashboard";
import Users from "@/pages/users";
import Properties from "@/pages/properties";
import PropertyDetail from "@/pages/property-detail";
import Visits from "@/pages/visits";
import VisitDetail from "@/pages/visit-detail";
import RatingCriteria from "@/pages/rating-criteria";
import ChecklistItems from "@/pages/checklist-items";
import AdminLayout from "@/components/layout/admin-layout";
import PublicHome from "@/pages/public/home";
import PublicPropertyDetail from "@/pages/public/property-detail";
import PublicPricing from "@/pages/public/pricing";
import PublicLayout from "@/components/layout/public-layout";
import UserDashboard from "@/pages/user-dashboard";
import UserLayout from "@/components/layout/user-layout";
import PublicLogin from "@/pages/public/login";

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/admin/login" />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
}

function UserProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  
  if (!isAuthenticated) {
    return <Redirect to="/login" />;
  }
  
  // Regular users (not admins) get user layout
  if (user?.role !== "admin") {
    return <UserLayout>{children}</UserLayout>;
  }
  
  // Admins can access user routes but see them in admin context
  return <AdminLayout>{children}</AdminLayout>;
}

function Router() {
  const { isAuthenticated } = useAuth();

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <PublicHome />
        </PublicLayout>
      </Route>
      
      <Route path="/property/:id">
        <PublicLayout>
          <PublicPropertyDetail />
        </PublicLayout>
      </Route>
      
      <Route path="/pricing">
        <PublicLayout>
          <PublicPricing />
        </PublicLayout>
      </Route>

      {/* User Authentication */}
      <Route path="/login">
        {isAuthenticated ? <Redirect to="/user" /> : <PublicLogin />}
      </Route>

      {/* User Dashboard Routes */}
      <Route path="/user">
        <UserProtectedRoute>
          <UserDashboard />
        </UserProtectedRoute>
      </Route>

      {/* Admin Routes */}
      <Route path="/admin/login">
        {isAuthenticated ? <Redirect to="/admin" /> : <Login />}
      </Route>
      
      <Route path="/admin">
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/users">
        <ProtectedRoute>
          <Users />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/properties">
        <ProtectedRoute>
          <Properties />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/properties/:id">
        {(params) => (
          <ProtectedRoute>
            <PropertyDetail propertyId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/visits">
        <ProtectedRoute>
          <Visits />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/visits/:id">
        {(params) => (
          <ProtectedRoute>
            <VisitDetail visitId={params.id} />
          </ProtectedRoute>
        )}
      </Route>
      
      <Route path="/admin/settings/ratings">
        <ProtectedRoute>
          <RatingCriteria />
        </ProtectedRoute>
      </Route>
      
      <Route path="/admin/settings/checklists">
        <ProtectedRoute>
          <ChecklistItems />
        </ProtectedRoute>
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
