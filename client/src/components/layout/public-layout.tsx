import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Home, 
  Building, 
  Calendar, 
  Smartphone, 
  Download, 
  Star 
} from "lucide-react";

interface PublicLayoutProps {
  children: React.ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  const [location] = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <a className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Home className="text-white" size={16} />
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">PropertyVisit</span>
                </a>
              </Link>
              
              <nav className="ml-10 flex space-x-8">
                <Link href="/">
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === "/" 
                      ? "border-blue-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                    <Building className="mr-2" size={16} />
                    Properties
                  </a>
                </Link>
                
                <Link href="/pricing">
                  <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                    location === "/pricing" 
                      ? "border-blue-500 text-gray-900" 
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}>
                    <Star className="mr-2" size={16} />
                    Pricing
                  </a>
                </Link>
                
                <a href="#features" className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  <Star className="mr-2" size={16} />
                  Features
                </a>
              </nav>
            </div>

            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="text-xs">
                <Calendar className="mr-1" size={12} />
                9 Rating Criteria
              </Badge>
              <Badge variant="secondary" className="text-xs">
                <Building className="mr-1" size={12} />
                8 Checklist Items
              </Badge>
              
              <div className="flex items-center space-x-2">
                <Button variant="outline" size="sm">
                  <Download className="mr-2" size={16} />
                  iOS App
                </Button>
                <Button variant="outline" size="sm">
                  <Download className="mr-2" size={16} />
                  Android App
                </Button>
              </div>

              <Link href="/login">
                <Button variant="outline">Login</Button>
              </Link>
              
              <Link href="/admin/login">
                <Button>Admin Portal</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Home className="text-white" size={16} />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">PropertyVisit</span>
              </div>
              <p className="mt-4 text-gray-600 max-w-md">
                Professional property evaluation system with comprehensive 9-category ratings 
                and 8-item checklists for informed property decisions.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Features</h3>
              <ul className="mt-4 space-y-2 text-sm text-gray-600">
                <li>• 9 Rating Categories</li>
                <li>• 8 Checklist Items</li>
                <li>• Property Comparison</li>
                <li>• Visit Tracking</li>
                <li>• Mobile Apps</li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">Get Started</h3>
              <div className="mt-4 space-y-2">
                <div className="flex items-center">
                  <Smartphone className="mr-2" size={16} />
                  <span className="text-sm text-gray-600">Available on iOS & Android</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 border-t border-gray-200 pt-8">
            <p className="text-center text-sm text-gray-500">
              © 2025 PropertyVisit. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}