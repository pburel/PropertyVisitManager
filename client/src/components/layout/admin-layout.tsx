import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

const pageNames: Record<string, string> = {
  "/": "Dashboard",
  "/users": "Users",
  "/properties": "Properties",
  "/visits": "Visits",
  "/settings/ratings": "Rating Criteria",
  "/settings/checklists": "Checklist Items",
};

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();
  
  const getPageName = () => {
    if (location.startsWith("/properties/")) return "Property Details";
    if (location.startsWith("/visits/")) return "Visit Details";
    return pageNames[location] || "Page";
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-semibold text-gray-900">{getPageName()}</h1>
            
            {/* Mobile menu button */}
            <Button variant="ghost" size="sm" className="md:hidden -mr-2 p-2">
              <Menu className="text-lg" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {children}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
