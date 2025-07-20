import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Edit, Trash2, Check, X, MapPin, User, Calendar } from "lucide-react";

interface VisitDetailProps {
  visitId: string;
}

export default function VisitDetail({ visitId }: VisitDetailProps) {
  const { data: visit, isLoading: visitLoading } = useQuery({
    queryKey: ["/api/visits", visitId],
  });

  const { data: property } = useQuery({
    queryKey: ["/api/properties", visit?.propertyId],
    enabled: !!visit?.propertyId,
  });

  const { data: user } = useQuery({
    queryKey: ["/api/profiles", visit?.userId],
    enabled: !!visit?.userId,
  });

  const { data: ratingCriteria } = useQuery({
    queryKey: ["/api/rating-criteria"],
  });

  const { data: checklistItems } = useQuery({
    queryKey: ["/api/checklist-items"],
  });

  if (visitLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!visit) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Visit not found</div>
        </CardContent>
      </Card>
    );
  }

  const ratings = visit.ratings || {};
  const checklist = visit.checklist || {};

  return (
    <div className="space-y-6">
      {/* Visit Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">Property Visit Details</CardTitle>
              <div className="flex items-center mt-2 space-x-4 text-gray-600">
                <div className="flex items-center">
                  <MapPin size={16} className="mr-1" />
                  {property?.address || "Loading..."}
                </div>
                <div className="flex items-center">
                  <User size={16} className="mr-1" />
                  {user?.fullName || "Loading..."}
                </div>
                <div className="flex items-center">
                  <Calendar size={16} className="mr-1" />
                  {format(new Date(visit.visitDate), "MMMM d, yyyy")}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline">
                <Edit size={16} className="mr-2" />
                Edit Visit
              </Button>
              <Button variant="destructive">
                <Trash2 size={16} className="mr-2" />
                Delete Visit
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Property Images */}
      {property?.imageUrls && property.imageUrls.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Property Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {property.imageUrls.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="rounded-lg object-cover h-24 w-full"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Rating Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Rating Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ratingCriteria?.filter((criteria: any) => criteria.isActive).map((criteria: any) => {
              const score = ratings[criteria.key] || 0;
              const percentage = (score / 5) * 100;
              
              return (
                <div key={criteria.key} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-700">{criteria.name}</span>
                    <span className="text-sm font-semibold text-gray-900">{score}/5</span>
                  </div>
                  <Progress 
                    value={percentage} 
                    className="w-full h-2"
                  />
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Checklist Section */}
      <Card>
        <CardHeader>
          <CardTitle>Inspection Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {checklistItems?.filter((item: any) => item.isActive).map((item: any) => {
              const isChecked = checklist[item.key];
              
              return (
                <div key={item.key} className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    {isChecked ? (
                      <Check className="text-green-500" size={20} />
                    ) : (
                      <X className="text-red-500" size={20} />
                    )}
                  </div>
                  <span className="text-sm text-gray-700">{item.name}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Visit Notes */}
      {visit.notes && (
        <Card>
          <CardHeader>
            <CardTitle>Visit Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-700">{visit.notes}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overall Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-medium text-gray-900">Overall Score:</span>
              <Badge 
                variant={parseFloat(visit.overallScore || "0") >= 4.0 ? "default" : "secondary"}
                className="text-lg px-3 py-1"
              >
                {visit.overallScore}/5
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
