import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { Plus, Edit, ToggleLeft, ToggleRight } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import RatingForm from "@/components/criteria/rating-form";
import type { RatingCriteria } from "@shared/schema";

export default function RatingCriteria() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCriteria, setEditingCriteria] = useState<RatingCriteria | null>(null);
  const { toast } = useToast();

  const { data: criteria, isLoading } = useQuery({
    queryKey: ["/api/rating-criteria"],
  });

  const toggleActiveMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const response = await apiRequest("PUT", `/api/rating-criteria/${id}`, { isActive });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rating-criteria"] });
      toast({
        title: "Success",
        description: "Rating criteria updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update rating criteria",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/rating-criteria/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rating-criteria"] });
      toast({
        title: "Success",
        description: "Rating criteria deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete rating criteria",
        variant: "destructive",
      });
    },
  });

  const handleToggleActive = (criteria: RatingCriteria) => {
    toggleActiveMutation.mutate({
      id: criteria.id,
      isActive: !criteria.isActive,
    });
  };

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this rating criteria?")) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (criteria: RatingCriteria) => {
    setEditingCriteria(criteria);
  };

  const handleEditClose = () => {
    setEditingCriteria(null);
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Rating Criteria Management</CardTitle>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2" size={16} />
                  Add New Criterion
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Rating Criterion</DialogTitle>
                </DialogHeader>
                <RatingForm onSuccess={() => setIsCreateDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
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
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Key
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {criteria?.map((criterion: RatingCriteria) => (
                    <tr key={criterion.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {criterion.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                          {criterion.key}
                        </code>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {criterion.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant={criterion.isActive ? "default" : "secondary"}>
                          {criterion.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(criterion)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleToggleActive(criterion)}
                            disabled={toggleActiveMutation.isPending}
                          >
                            {criterion.isActive ? (
                              <ToggleRight size={16} className="text-green-600" />
                            ) : (
                              <ToggleLeft size={16} className="text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {criteria?.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No rating criteria found.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingCriteria} onOpenChange={() => handleEditClose()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Rating Criterion</DialogTitle>
          </DialogHeader>
          {editingCriteria && (
            <RatingForm
              initialData={editingCriteria}
              onSuccess={handleEditClose}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
