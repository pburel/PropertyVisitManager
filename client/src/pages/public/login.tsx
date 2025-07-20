import { useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/lib/auth";
import { Link } from "wouter";
import {
  Home,
  Mail,
  Lock,
  AlertCircle,
  User,
  Crown,
  ArrowLeft
} from "lucide-react";

export default function PublicLogin() {
  const [, navigate] = useLocation();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      // Redirect based on user role will be handled by auth context
      navigate("/user");
    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (userType: 'user' | 'admin') => {
    setError("");
    setIsLoading(true);

    try {
      if (userType === 'user') {
        await login("demo@propertyvisit.com", "demo123");
        navigate("/user");
      } else {
        await login("admin@propertyvisit.com", "admin123");
        navigate("/admin");
      }
    } catch (err) {
      setError("Demo login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link href="/">
            <Button variant="ghost" size="sm" className="mb-6">
              <ArrowLeft className="mr-2" size={16} />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center justify-center mb-6">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Home className="text-white" size={24} />
            </div>
          </div>
          
          <h2 className="text-3xl font-bold text-gray-900">
            Sign in to PropertyVisit
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Access your property evaluation dashboard
          </p>
        </div>

        {/* Demo Credentials */}
        <div className="bg-white rounded-lg p-4 border border-blue-200">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Demo Credentials</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <User className="h-4 w-4 text-gray-600 mr-2" />
                <div>
                  <div className="text-sm font-medium">Regular User</div>
                  <div className="text-xs text-gray-500">demo@propertyvisit.com</div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
              >
                Try Demo
              </Button>
            </div>
            
            <div className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <div className="flex items-center">
                <Crown className="h-4 w-4 text-purple-600 mr-2" />
                <div>
                  <div className="text-sm font-medium">Admin User</div>
                  <div className="text-xs text-gray-500">admin@propertyvisit.com</div>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
              >
                Try Admin
              </Button>
            </div>
          </div>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle>Sign In</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Sign Up Link */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <Link href="/signup">
              <a className="font-medium text-blue-600 hover:text-blue-500">
                Sign up for free
              </a>
            </Link>
          </p>
        </div>

        {/* Features Preview */}
        <div className="bg-white rounded-lg p-4 border">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">What you'll get:</h3>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Evaluate up to 3 properties (Free plan)</li>
            <li>• 9 comprehensive rating categories</li>
            <li>• 8-item property checklist</li>
            <li>• Property comparison tools</li>
            <li>• Visit tracking and history</li>
          </ul>
        </div>
      </div>
    </div>
  );
}