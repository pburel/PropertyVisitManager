import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "wouter";
import { format } from "date-fns";
import { Search, Eye, Calendar } from "lucide-react";

export default function Visits() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: visits, isLoading: visitsLoading } = useQuery({
    queryKey: ["/api/visits"],
  });

  const { data: properties } = useQuery({
    queryKey: ["/api/properties"],
  });

  const { data: profiles } = useQuery({
    queryKey: ["/api/profiles"],
  });

  const getPropertyAddress = (propertyId: string) => {
    const property = properties?.find((p: any) => p.id === propertyId);
    return property?.address || "Unknown Property";
  };

  const getProfileName = (userId: string) => {
    const profile = profiles?.find((p: any) => p.id === userId);
    return profile?.fullName || "Unknown User";
  };

  const filteredVisits = visits?.filter((visit: any) => {
    const propertyAddress = getPropertyAddress(visit.propertyId).toLowerCase();
    const userName = getProfileName(visit.userId).toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return propertyAddress.includes(search) || userName.includes(search);
  }) || [];

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Visit Management</CardTitle>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              placeholder="Search visits by property or user..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {visitsLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Property
                    </th>
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
                  {filteredVisits.map((visit: any) => (
                    <tr key={visit.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {getPropertyAddress(visit.propertyId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {getProfileName(visit.userId)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar size={16} className="mr-2" />
                          {format(new Date(visit.visitDate), "MMM d, yyyy")}
                        </div>
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
              
              {filteredVisits.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No visits found matching your search." : "No visits found."}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
