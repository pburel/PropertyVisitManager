import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { useState } from "react";
import {
  Building,
  Plus,
  Star,
  Calendar,
  MapPin,
  Eye,
  TrendingUp,
  CheckCircle,
  XCircle,
  BarChart3,
  Filter
} from "lucide-react";
import { queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import type { Property, Visit, RatingCriteria, ChecklistItem } from "@shared/schema";

export default function UserDashboard() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState<string>("all");

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { userId: user?.id }],
    queryFn: async () => {
      const response = await fetch(`/api/properties?userId=${user?.id}`);
      return response.json();
    }
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/visits", { userId: user?.id }],
    queryFn: async () => {
      const response = await fetch(`/api/visits?userId=${user?.id}`);
      return response.json();
    }
  });

  const { data: ratingCriteria = [] } = useQuery<RatingCriteria[]>({
    queryKey: ["/api/rating-criteria"],
  });

  const { data: checklistItems = [] } = useQuery<ChecklistItem[]>({
    queryKey: ["/api/checklist-items"],
  });

  const getPropertyVisits = (propertyId: string) => {
    return visits.filter(visit => visit.propertyId === propertyId);
  };

  const getAverageRating = (propertyId: string) => {
    const propertyVisits = getPropertyVisits(propertyId);
    if (propertyVisits.length === 0) return null;
    
    const scores = propertyVisits
      .map(visit => visit.overallScore)
      .filter(score => score && !isNaN(Number(score)))
      .map(Number);
    
    if (scores.length === 0) return null;
    return (scores.reduce((sum, score) => sum + score, 0) / scores.length).toFixed(1);
  };

  const getPropertyStats = (propertyId: string) => {
    const propertyVisits = getPropertyVisits(propertyId);
    
    if (propertyVisits.length === 0) {
      return { avgRating: 0, checklistScore: 0, totalVisits: 0 };
    }

    // Calculate average rating
    const scores = propertyVisits
      .map(visit => visit.overallScore)
      .filter(score => score && !isNaN(Number(score)))
      .map(Number);
    
    const avgRating = scores.length > 0 
      ? scores.reduce((sum, score) => sum + score, 0) / scores.length 
      : 0;

    // Calculate checklist score
    let totalChecks = 0;
    let positiveChecks = 0;
    
    propertyVisits.forEach(visit => {
      if (visit.checklist && typeof visit.checklist === 'object') {
        const checklist = visit.checklist as Record<string, boolean>;
        Object.values(checklist).forEach(value => {
          totalChecks++;
          if (value) positiveChecks++;
        });
      }
    });

    const checklistScore = totalChecks > 0 ? (positiveChecks / totalChecks) * 100 : 0;

    return {
      avgRating,
      checklistScore,
      totalVisits: propertyVisits.length
    };
  };

  const filteredProperties = properties.filter(property => {
    if (selectedFilter === "all") return true;
    if (selectedFilter === "rated") return getAverageRating(property.id) !== null;
    if (selectedFilter === "unrated") return getAverageRating(property.id) === null;
    if (selectedFilter === "recent") {
      const recentVisits = visits.filter(visit => 
        visit.propertyId === property.id && 
        new Date(visit.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      return recentVisits.length > 0;
    }
    return true;
  });

  const recentVisits = visits
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const totalProperties = properties.length;
  const totalVisits = visits.length;
  const ratedProperties = properties.filter(p => getAverageRating(p.id) !== null).length;
  const avgOverallRating = properties.length > 0 
    ? properties.reduce((sum, p) => sum + (Number(getAverageRating(p.id)) || 0), 0) / ratedProperties || 0
    : 0;

  if (propertiesLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-300 rounded w-1/3"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-300 rounded-lg"></div>)}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Properties</h1>
              <p className="text-gray-600 mt-1">
                Welcome back, {user?.fullName}! Here's your property evaluation dashboard.
              </p>
            </div>
            <Link href="/user/add-property">
              <Button>
                <Plus className="mr-2" size={20} />
                Add Property
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Building className="h-8 w-8 text-blue-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{totalProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-green-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Visits</p>
                  <p className="text-2xl font-bold text-gray-900">{totalVisits}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Rated Properties</p>
                  <p className="text-2xl font-bold text-gray-900">{ratedProperties}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-purple-500" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Avg Rating</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {avgOverallRating > 0 ? avgOverallRating.toFixed(1) : "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Properties Section */}
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">My Properties</h2>
              
              <div className="flex items-center space-x-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <select 
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm"
                >
                  <option value="all">All Properties</option>
                  <option value="rated">Rated Only</option>
                  <option value="unrated">Unrated Only</option>
                  <option value="recent">Recently Visited</option>
                </select>
              </div>
            </div>

            {filteredProperties.length === 0 ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {properties.length === 0 ? "No properties yet" : "No properties match your filter"}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {properties.length === 0 
                      ? "Start by adding your first property to begin evaluating."
                      : "Try adjusting your filter to see more properties."
                    }
                  </p>
                  {properties.length === 0 && (
                    <Link href="/user/add-property">
                      <Button>
                        <Plus className="mr-2" size={20} />
                        Add Your First Property
                      </Button>
                    </Link>
                  )}
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredProperties.map((property) => {
                  const stats = getPropertyStats(property.id);
                  const avgRating = getAverageRating(property.id);
                  
                  return (
                    <Card key={property.id} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-start justify-between mb-2">
                              <h3 className="text-lg font-semibold text-gray-900">
                                {property.address}
                              </h3>
                              {avgRating && (
                                <div className="flex items-center ml-4">
                                  <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                  <span className="ml-1 font-medium">{avgRating}/5</span>
                                </div>
                              )}
                            </div>
                            
                            <div className="flex items-center text-gray-600 mb-4">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span className="text-sm">
                                {[property.city, property.postalCode].filter(Boolean).join(", ")}
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                              <div className="text-center">
                                <div className="text-lg font-semibold">{stats.totalVisits}</div>
                                <div className="text-xs text-gray-500">Visits</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">
                                  {stats.avgRating > 0 ? stats.avgRating.toFixed(1) : "—"}
                                </div>
                                <div className="text-xs text-gray-500">Avg Rating</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">
                                  {stats.checklistScore.toFixed(0)}%
                                </div>
                                <div className="text-xs text-gray-500">Checklist</div>
                              </div>
                              <div className="text-center">
                                <div className="text-lg font-semibold">
                                  {property.propertyType || "—"}
                                </div>
                                <div className="text-xs text-gray-500">Type</div>
                              </div>
                            </div>

                            {/* Progress bars for quick insights */}
                            <div className="space-y-2 mb-4">
                              <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Overall Rating</span>
                                  <span>{stats.avgRating > 0 ? `${stats.avgRating.toFixed(1)}/5` : "Not rated"}</span>
                                </div>
                                <Progress value={stats.avgRating * 20} className="h-2" />
                              </div>
                              <div>
                                <div className="flex justify-between text-xs text-gray-600 mb-1">
                                  <span>Checklist Score</span>
                                  <span>{stats.checklistScore.toFixed(0)}%</span>
                                </div>
                                <Progress value={stats.checklistScore} className="h-2" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="flex justify-between items-center pt-4 border-t">
                          <div className="flex space-x-2">
                            {property.propertyType && (
                              <Badge variant="outline">{property.propertyType}</Badge>
                            )}
                            {stats.totalVisits > 0 && (
                              <Badge variant="secondary">{stats.totalVisits} visits</Badge>
                            )}
                          </div>
                          
                          <div className="flex space-x-2">
                            <Link href={`/user/property/${property.id}`}>
                              <Button variant="outline" size="sm">
                                <Eye className="mr-2" size={16} />
                                View Details
                              </Button>
                            </Link>
                            <Link href={`/user/property/${property.id}/visit`}>
                              <Button size="sm">
                                <Plus className="mr-2" size={16} />
                                Add Visit
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Visits */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Recent Visits
                </CardTitle>
              </CardHeader>
              <CardContent>
                {recentVisits.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No recent visits</p>
                ) : (
                  <div className="space-y-3">
                    {recentVisits.map(visit => {
                      const property = properties.find(p => p.id === visit.propertyId);
                      return (
                        <div key={visit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                          <div>
                            <div className="font-medium text-sm line-clamp-1">
                              {property?.address || "Unknown Property"}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(visit.visitDate).toLocaleDateString()}
                            </div>
                          </div>
                          {visit.overallScore && (
                            <div className="flex items-center">
                              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                              <span className="text-sm font-medium">{visit.overallScore}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/user/add-property">
                  <Button className="w-full justify-start">
                    <Plus className="mr-2" size={16} />
                    Add New Property
                  </Button>
                </Link>
                <Link href="/user/compare-properties">
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="mr-2" size={16} />
                    Compare Properties
                  </Button>
                </Link>
                <Link href="/user/visit-history">
                  <Button variant="outline" className="w-full justify-start">
                    <Calendar className="mr-2" size={16} />
                    View All Visits
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Account Limits (Freemium) */}
            <Card>
              <CardHeader>
                <CardTitle>Account Usage</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Properties</span>
                      <span>{totalProperties}/3</span>
                    </div>
                    <Progress value={(totalProperties / 3) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">Free plan limit</p>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Monthly Visits</span>
                      <span>{visits.filter(v => new Date(v.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}/5</span>
                    </div>
                    <Progress value={(visits.filter(v => new Date(v.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length / 5) * 100} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">This month</p>
                  </div>
                  
                  <Link href="/pricing">
                    <Button variant="outline" size="sm" className="w-full mt-4">
                      Upgrade to Pro
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}