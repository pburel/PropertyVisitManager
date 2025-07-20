import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Link } from "wouter";
import { 
  Building, 
  MapPin, 
  Star,
  CheckCircle,
  Calendar,
  DollarSign,
  Users,
  Shield,
  Zap
} from "lucide-react";
import type { Property, Visit } from "@shared/schema";

// Sample user for demonstration
const DEMO_USER_ID = "demo-user-123";

export default function PublicHome() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { userId: DEMO_USER_ID }],
    queryFn: async () => {
      const response = await fetch(`/api/properties?userId=${DEMO_USER_ID}`);
      return response.json();
    }
  });

  const { data: visits = [] } = useQuery<Visit[]>({
    queryKey: ["/api/visits"],
  });

  const filteredProperties = properties.filter(property =>
    property.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Professional Property Evaluation
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Comprehensive 9-category rating system with 8-item checklists for informed property decisions
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <Input
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white text-gray-900"
              />
              <Button size="lg" variant="secondary">
                <Building className="mr-2" size={20} />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose PropertyVisit?
            </h2>
            <p className="text-lg text-gray-600">
              Our comprehensive evaluation system helps you make informed property decisions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Star className="w-8 h-8 text-blue-500 mb-2" />
                <CardTitle>9 Rating Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Comprehensive evaluation covering all aspects from luminosity to value for money
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Luminosity & Lighting</li>
                  <li>• Noise Levels</li>
                  <li>• Thermal Insulation</li>
                  <li>• General Condition</li>
                  <li>• And 5 more criteria...</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CheckCircle className="w-8 h-8 text-green-500 mb-2" />
                <CardTitle>8-Item Checklist</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Essential checks to identify potential issues and advantages
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Mold Presence</li>
                  <li>• Cleanliness</li>
                  <li>• Window Functionality</li>
                  <li>• Internet Connectivity</li>
                  <li>• And 4 more items...</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calendar className="w-8 h-8 text-purple-500 mb-2" />
                <CardTitle>Visit Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Schedule visits, track evaluations, and compare properties over time
                </p>
                <ul className="text-sm text-gray-500 space-y-1">
                  <li>• Visit Scheduling</li>
                  <li>• Historical Data</li>
                  <li>• Property Comparison</li>
                  <li>• Progress Tracking</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Properties Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900">
              Available Properties
            </h2>
            <Badge variant="secondary">
              {filteredProperties.length} Properties
            </Badge>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-300 rounded-t-lg"></div>
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredProperties.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
              <p className="text-gray-600">
                {searchTerm ? "Try adjusting your search terms" : "No properties have been added yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProperties.map((property) => {
                const averageRating = getAverageRating(property.id);
                const visitCount = getPropertyVisits(property.id).length;
                
                return (
                  <Card key={property.id} className="hover:shadow-lg transition-shadow">
                    {property.imageUrls && property.imageUrls.length > 0 ? (
                      <div className="h-48 bg-gray-200 rounded-t-lg bg-cover bg-center" 
                           style={{ backgroundImage: `url(${property.imageUrls[0]})` }} />
                    ) : (
                      <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 rounded-t-lg flex items-center justify-center">
                        <Building className="h-12 w-12 text-gray-400" />
                      </div>
                    )}
                    
                    <CardContent className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
                          {property.address}
                        </h3>
                        {averageRating && (
                          <div className="flex items-center">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="ml-1 text-sm font-medium text-gray-900">{averageRating}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center text-gray-600 mb-4">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {[property.city, property.postalCode].filter(Boolean).join(", ")}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {property.propertyType && (
                          <Badge variant="outline">{property.propertyType}</Badge>
                        )}
                        {property.bedrooms && (
                          <Badge variant="outline">{property.bedrooms} beds</Badge>
                        )}
                        {property.bathrooms && (
                          <Badge variant="outline">{property.bathrooms} baths</Badge>
                        )}
                        {property.squareMeters && (
                          <Badge variant="outline">{property.squareMeters}m²</Badge>
                        )}
                      </div>

                      <div className="flex justify-between items-center mb-4">
                        {property.price && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 text-green-600" />
                            <span className="font-semibold text-gray-900">{property.price}</span>
                          </div>
                        )}
                        
                        {visitCount > 0 && (
                          <Badge variant="secondary">
                            <Users className="h-3 w-3 mr-1" />
                            {visitCount} visits
                          </Badge>
                        )}
                      </div>

                      <Link href={`/property/${property.id}`}>
                        <Button className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl font-bold mb-2">{properties.length}</div>
              <div className="text-blue-100">Properties Evaluated</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">{visits.length}</div>
              <div className="text-blue-100">Total Visits</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">9</div>
              <div className="text-blue-100">Rating Categories</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">8</div>
              <div className="text-blue-100">Checklist Items</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}