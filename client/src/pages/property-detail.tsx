import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { Building, Edit, MapPin, Bed, Bath, Ruler, Eye } from "lucide-react";

interface PropertyDetailProps {
  propertyId: string;
}

export default function PropertyDetail({ propertyId }: PropertyDetailProps) {
  const { data: property, isLoading: propertyLoading } = useQuery({
    queryKey: ["/api/properties", propertyId],
  });

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["/api/properties", propertyId, "visits"],
  });

  const { data: profiles } = useQuery({
    queryKey: ["/api/profiles"],
  });

  const getProfileName = (userId: string) => {
    const profile = profiles?.find((p: any) => p.id === userId);
    return profile?.fullName || "Unknown User";
  };

  if (propertyLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (!property) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-gray-500">Property not found</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Property Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{property.address}</CardTitle>
              <div className="flex items-center mt-2 text-gray-600">
                <MapPin size={16} className="mr-1" />
                {property.city}, {property.postalCode}
              </div>
            </div>
            <Button>
              <Edit size={16} className="mr-2" />
              Edit Property
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Property Images */}
          {property.imageUrls && property.imageUrls.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {property.imageUrls.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`Property ${index + 1}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* Property Details */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Property Details</h3>
              <div className="space-y-2">
                <div className="flex items-center">
                  <Building size={16} className="mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600">Type:</span>
                  <Badge variant="secondary" className="ml-2">
                    {property.propertyType || "N/A"}
                  </Badge>
                </div>
                {property.bedrooms && (
                  <div className="flex items-center">
                    <Bed size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Bedrooms:</span>
                    <span className="ml-2 font-medium">{property.bedrooms}</span>
                  </div>
                )}
                {property.bathrooms && (
                  <div className="flex items-center">
                    <Bath size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Bathrooms:</span>
                    <span className="ml-2 font-medium">{property.bathrooms}</span>
                  </div>
                )}
                {property.squareMeters && (
                  <div className="flex items-center">
                    <Ruler size={16} className="mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">Square Meters:</span>
                    <span className="ml-2 font-medium">{property.squareMeters}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Financial</h3>
              <div className="space-y-2">
                {property.price && (
                  <div>
                    <span className="text-sm text-gray-600">Price:</span>
                    <div className="text-2xl font-bold text-green-600">${property.price}</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Metadata</h3>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Created:</span>
                  <div className="text-sm font-medium">
                    {format(new Date(property.createdAt), "MMM d, yyyy")}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          {property.description && (
            <div className="mt-6">
              <h3 className="font-semibold text-gray-900 mb-3">Description</h3>
              <p className="text-gray-600">{property.description}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Property Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Property Visits</CardTitle>
        </CardHeader>
        <CardContent>
          {visitsLoading ? (
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : visits && visits.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Visit Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Overall Score
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {visits.map((visit: any) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {getProfileName(visit.userId)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(new Date(visit.visitDate), "MMM d, yyyy")}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge 
                          variant={parseFloat(visit.overallScore || "0") >= 4.0 ? "default" : "secondary"}
                        >
                          {visit.overallScore}/5
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link href={`/visits/${visit.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye size={16} className="mr-1" />
                            View Details
                          </Button>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No visits recorded for this property yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
