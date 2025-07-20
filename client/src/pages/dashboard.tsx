import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { 
  Users, 
  Building, 
  CalendarCheck, 
  Star, 
  Plus, 
  Download, 
  UserCog, 
  TrendingUp,
  ArrowRight
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: recentVisits, isLoading: visitsLoading } = useQuery({
    queryKey: ["/api/visits"],
    select: (data) => data?.slice(0, 3) || [],
  });

  const { data: topProperties, isLoading: propertiesLoading } = useQuery({
    queryKey: ["/api/properties"],
    select: (data) => {
      if (!data) return [];
      return data.slice(0, 3);
    },
  });

  const { data: profiles } = useQuery({
    queryKey: ["/api/profiles"],
  });

  const getProfileName = (userId: string) => {
    const profile = profiles?.find((p: any) => p.id === userId);
    return profile?.fullName || "Unknown User";
  };

  const getPropertyAddress = (propertyId: string) => {
    const property = topProperties?.find((p: any) => p.id === propertyId);
    return property?.address || "Unknown Property";
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Welcome back, Admin!</h2>
        <p className="mt-2 text-gray-600">Here's what's happening with your property portfolio today.</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="text-blue-600" size={16} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Users</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalUsers || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-green-600 font-medium">+12%</span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Building className="text-emerald-600" size={16} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Properties</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalProperties || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-green-600 font-medium">+8%</span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <CalendarCheck className="text-purple-600" size={16} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Visits</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : stats?.totalVisits || 0}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-green-600 font-medium">+23%</span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <Star className="text-amber-600" size={16} />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Avg Rating</dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {statsLoading ? <Skeleton className="h-8 w-16" /> : (stats?.averageRating || 0).toFixed(1)}
                  </dd>
                </dl>
              </div>
            </div>
            <div className="mt-3 flex items-center">
              <span className="text-sm text-green-600 font-medium">+0.3</span>
              <span className="ml-2 text-sm text-gray-500">from last month</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity & Properties Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Recent Visits */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Visits</CardTitle>
          </CardHeader>
          <CardContent>
            {visitsLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {recentVisits?.map((visit: any) => (
                  <div key={visit.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-900">
                        {getPropertyAddress(visit.propertyId)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {getProfileName(visit.userId)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge 
                        variant={parseFloat(visit.overallScore || "0") >= 4.0 ? "default" : "secondary"}
                      >
                        {visit.overallScore}
                      </Badge>
                      <span className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(visit.visitDate), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <Link href="/visits">
                <a className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center">
                  View all visits <ArrowRight size={16} className="ml-1" />
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Top Rated Properties */}
        <Card>
          <CardHeader>
            <CardTitle>Top Rated Properties</CardTitle>
          </CardHeader>
          <CardContent>
            {propertiesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {topProperties?.map((property: any) => (
                  <div key={property.id} className="flex items-center space-x-4">
                    <img 
                      src={property.imageUrls?.[0] || "https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=80&h=80"} 
                      alt="Property" 
                      className="w-12 h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{property.address}</p>
                      <p className="text-sm text-gray-500">{property.city}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="default">4.5</Badge>
                      <Star className="text-amber-400" size={16} />
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-3 border-t border-gray-200">
              <Link href="/properties">
                <a className="text-sm text-blue-600 hover:text-blue-500 font-medium flex items-center">
                  View all properties <ArrowRight size={16} className="ml-1" />
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link href="/properties">
              <Button className="w-full" variant="default">
                <Plus className="mr-2" size={16} />
                Add Property
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              <Download className="mr-2" size={16} />
              Export Data
            </Button>
            <Link href="/users">
              <Button variant="outline" className="w-full">
                <UserCog className="mr-2" size={16} />
                Manage Users
              </Button>
            </Link>
            <Button variant="outline" className="w-full">
              <TrendingUp className="mr-2" size={16} />
              View Reports
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
