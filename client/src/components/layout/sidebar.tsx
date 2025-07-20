import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/auth";
import {
  Home,
  Users,
  Building,
  CalendarCheck,
  Star,
  CheckSquare,
  LogOut,
} from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/admin", icon: Home },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Properties", href: "/admin/properties", icon: Building },
  { name: "Visits", href: "/admin/visits", icon: CalendarCheck },
];

const settings = [
  { name: "Rating Criteria", href: "/admin/settings/ratings", icon: Star },
  { name: "Checklist Items", href: "/admin/settings/checklists", icon: CheckSquare },
];

export default function Sidebar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r border-gray-200">
        {/* Logo/Brand */}
        <div className="flex items-center flex-shrink-0 px-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Home className="text-white" size={16} />
            </div>
            <span className="ml-2 text-xl font-semibold text-gray-900">PropertyVisit</span>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="mt-8 flex-1 px-2 pb-4 space-y-1">
          {navigation.map((item) => {
            const isActive = location === item.href;
            return (
              <Link key={item.name} href={item.href}>
                <a
                  className={cn(
                    "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "mr-3",
                      isActive ? "text-blue-500" : "text-gray-400"
                    )}
                    size={16}
                  />
                  {item.name}
                </a>
              </Link>
            );
          })}
          
          {/* Settings Section */}
          <div className="pt-4">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Settings</h3>
            <div className="mt-2 space-y-1">
              {settings.map((item) => {
                const isActive = location === item.href;
                return (
                  <Link key={item.name} href={item.href}>
                    <a
                      className={cn(
                        "group flex items-center px-2 py-2 text-sm font-medium rounded-md",
                        isActive
                          ? "bg-blue-50 text-blue-700"
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                    >
                      <item.icon
                        className={cn(
                          "mr-3",
                          isActive ? "text-blue-500" : "text-gray-400"
                        )}
                        size={16}
                      />
                      {item.name}
                    </a>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>
        
        {/* User Profile & Sign Out */}
        <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <Users className="text-gray-600" size={16} />
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-700">{user?.fullName}</p>
              <Button
                variant="ghost"
                size="sm"
                className="text-xs text-gray-500 hover:text-gray-700 p-0 h-auto"
                onClick={logout}
              >
                <LogOut className="mr-1" size={12} />
                Sign out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
