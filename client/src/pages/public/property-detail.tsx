import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useRoute } from "wouter";
import { Link } from "wouter";
import {
  Building,
  MapPin,
  Star,
  Calendar,
  DollarSign,
  BedDouble,
  Bath,
  Maximize,
  ArrowLeft,
  CheckCircle,
  XCircle,
  User
} from "lucide-react";
import type { Property, Visit, RatingCriteria, ChecklistItem } from "@shared/schema";

export default function PublicPropertyDetail() {
  const [match, params] = useRoute("/property/:id");
  const propertyId = params?.id;

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: ["/api/properties", propertyId],
    enabled: !!propertyId,
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/properties", propertyId, "visits"],
    enabled: !!propertyId,
  });

  const { data: ratingCriteria = [] } = useQuery<RatingCriteria[]>({
    queryKey: ["/api/rating-criteria"],
  });

  const { data: checklistItems = [] } = useQuery<ChecklistItem[]>({
    queryKey: ["/api/checklist-items"],
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-300 rounded-lg mb-6"></div>
                <div className="h-64 bg-gray-300 rounded-lg"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Property not found</h1>
          <p className="text-gray-600 mb-6">The property you're looking for doesn't exist.</p>
          <Link href="/">
            <Button>
              <ArrowLeft className="mr-2" size={16} />
              Back to Properties
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const getAverageRatings = () => {
    if (visits.length === 0) return {};
    
    const averages: Record<string, number> = {};
    
    ratingCriteria.forEach(criteria => {
      const scores = visits
        .map(visit => visit.ratings && typeof visit.ratings === 'object' 
          ? (visit.ratings as Record<string, number>)[criteria.key] 
          : null)
        .filter((score): score is number => score !== null && !isNaN(score));
      
      if (scores.length > 0) {
        averages[criteria.key] = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      }
    });
    
    return averages;
  };

  const getChecklistSummary = () => {
    if (visits.length === 0) return {};
    
    const summary: Record<string, { positive: number; total: number }> = {};
    
    checklistItems.forEach(item => {
      const results = visits
        .map(visit => visit.checklist && typeof visit.checklist === 'object'
          ? (visit.checklist as Record<string, boolean>)[item.key]
          : null)
        .filter((result): result is boolean => result !== null);
      
      if (results.length > 0) {
        summary[item.key] = {
          positive: results.filter(Boolean).length,
          total: results.length
        };
      }
    });
    
    return summary;
  };

  const averageRatings = getAverageRatings();
  const checklistSummary = getChecklistSummary();
  
  const overallAverage = Object.values(averageRatings).length > 0
    ? Object.values(averageRatings).reduce((sum, score) => sum + score, 0) / Object.values(averageRatings).length
    : 0;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="mr-2" size={16} />
              Back to Properties
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <Card>
              <CardContent className="p-0">
                {property.imageUrls && property.imageUrls.length > 0 ? (
                  <div className="aspect-video bg-cover bg-center rounded-lg"
                       style={{ backgroundImage: `url(${property.imageUrls[0]})` }} />
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                    <Building className="h-16 w-16 text-gray-400" />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Details */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl">{property.address}</CardTitle>
                    <div className="flex items-center text-gray-600 mt-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span>{[property.city, property.postalCode, property.country].filter(Boolean).join(", ")}</span>
                    </div>
                  </div>
                  
                  {overallAverage > 0 && (
                    <div className="flex items-center">
                      <Star className="h-5 w-5 text-yellow-400 fill-current mr-1" />
                      <span className="text-xl font-bold">{overallAverage.toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">/5.0</span>
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  {property.propertyType && (
                    <div className="text-center">
                      <div className="text-lg font-semibold">{property.propertyType}</div>
                      <div className="text-sm text-gray-500">Type</div>
                    </div>
                  )}
                  {property.bedrooms && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <BedDouble className="h-4 w-4 mr-1" />
                        <span className="text-lg font-semibold">{property.bedrooms}</span>
                      </div>
                      <div className="text-sm text-gray-500">Bedrooms</div>
                    </div>
                  )}
                  {property.bathrooms && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Bath className="h-4 w-4 mr-1" />
                        <span className="text-lg font-semibold">{property.bathrooms}</span>
                      </div>
                      <div className="text-sm text-gray-500">Bathrooms</div>
                    </div>
                  )}
                  {property.squareMeters && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-1">
                        <Maximize className="h-4 w-4 mr-1" />
                        <span className="text-lg font-semibold">{property.squareMeters}</span>
                      </div>
                      <div className="text-sm text-gray-500">m²</div>
                    </div>
                  )}
                </div>

                {property.price && (
                  <div className="flex items-center mb-6">
                    <DollarSign className="h-5 w-5 text-green-600 mr-1" />
                    <span className="text-2xl font-bold text-green-600">{property.price}</span>
                  </div>
                )}

                {property.description && (
                  <div>
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-gray-600">{property.description}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Rating Summary */}
            {Object.keys(averageRatings).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Rating Summary</CardTitle>
                  <p className="text-sm text-gray-600">
                    Average ratings based on {visits.length} visit{visits.length !== 1 ? 's' : ''}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {ratingCriteria.map(criteria => {
                      const average = averageRatings[criteria.key];
                      if (!average) return null;
                      
                      return (
                        <div key={criteria.key}>
                          <div className="flex justify-between items-center mb-2">
                            <span className="font-medium">{criteria.name}</span>
                            <span className="text-sm font-semibold">{average.toFixed(1)}/5.0</span>
                          </div>
                          <Progress value={(average / 5) * 100} className="h-2" />
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Checklist Summary */}
            {Object.keys(checklistSummary).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Checklist Summary</CardTitle>
                  <p className="text-sm text-gray-600">
                    Results based on {visits.length} visit{visits.length !== 1 ? 's' : ''}
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {checklistItems.map(item => {
                      const summary = checklistSummary[item.key];
                      if (!summary) return null;
                      
                      const percentage = (summary.positive / summary.total) * 100;
                      
                      return (
                        <div key={item.key} className="flex items-center space-x-3">
                          {percentage >= 50 ? (
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                          <div className="flex-1">
                            <div className="font-medium">{item.name}</div>
                            <div className="text-sm text-gray-500">
                              {summary.positive}/{summary.total} positive ({percentage.toFixed(0)}%)
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Visit History */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="mr-2" size={20} />
                  Visit History
                </CardTitle>
              </CardHeader>
              <CardContent>
                {visits.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No visits recorded</p>
                ) : (
                  <div className="space-y-3">
                    {visits.slice(0, 5).map(visit => (
                      <div key={visit.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium">
                            {new Date(visit.visitDate).toLocaleDateString()}
                          </div>
                          {visit.overallScore && (
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-3 w-3 text-yellow-400 fill-current mr-1" />
                              {visit.overallScore}/5.0
                            </div>
                          )}
                        </div>
                        <User className="h-4 w-4 text-gray-400" />
                      </div>
                    ))}
                    {visits.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        And {visits.length - 5} more visits...
                      </p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Property Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Visits</span>
                    <span className="font-semibold">{visits.length}</span>
                  </div>
                  {overallAverage > 0 && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Overall Rating</span>
                      <span className="font-semibold">{overallAverage.toFixed(1)}/5.0</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Listed Since</span>
                    <span className="font-semibold">
                      {new Date(property.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}