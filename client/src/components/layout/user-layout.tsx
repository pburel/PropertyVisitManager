import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Home, 
  Building, 
  Calendar, 
  BarChart3, 
  User,
  LogOut,
  Settings,
  Plus
} from "lucide-react";

interface UserLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/user", icon: Home },
  { name: "My Properties", href: "/user/properties", icon: Building },
  { name: "Visit History", href: "/user/visits", icon: Calendar },
  { name: "Compare", href: "/user/compare", icon: BarChart3 },
];

export default function UserLayout({ children }: UserLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white shadow-sm border-b">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center">
              <Link href="/user">
                <a className="flex items-center">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                    <Home className="text-white" size={16} />
                  </div>
                  <span className="ml-3 text-xl font-bold text-gray-900">PropertyVisit</span>
                </a>
              </Link>
              
              <nav className="ml-10 flex space-x-8">
                {navigation.map((item) => {
                  const isActive = location === item.href || 
                    (item.href === "/user" && location === "/user") ||
                    (item.href !== "/user" && location.startsWith(item.href));
                    
                  return (
                    <Link key={item.name} href={item.href}>
                      <a className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                        isActive
                          ? "border-blue-500 text-gray-900" 
                          : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                      }`}>
                        <item.icon className="mr-2" size={16} />
                        {item.name}
                      </a>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* User Menu and Actions */}
            <div className="flex items-center space-x-4">
              <Link href="/user/add-property">
                <Button size="sm">
                  <Plus className="mr-2" size={16} />
                  Add Property
                </Button>
              </Link>
              
              <div className="flex items-center space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.avatarUrl || undefined} />
                  <AvatarFallback className="bg-blue-500 text-white text-sm">
                    {user?.fullName ? getInitials(user.fullName) : "U"}
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden md:block">
                  <div className="text-sm font-medium text-gray-900">{user?.fullName}</div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Link href="/user/settings">
                    <Button variant="ghost" size="sm">
                      <Settings size={16} />
                    </Button>
                  </Link>
                  
                  <Button variant="ghost" size="sm" onClick={logout}>
                    <LogOut size={16} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        {children}
      </main>
    </div>
  );
}