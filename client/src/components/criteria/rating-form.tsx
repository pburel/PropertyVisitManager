import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertRatingCriteriaSchema, type InsertRatingCriteria, type RatingCriteria } from "@shared/schema";

interface RatingFormProps {
  onSuccess?: () => void;
  initialData?: RatingCriteria;
}

export default function RatingForm({ onSuccess, initialData }: RatingFormProps) {
  const { toast } = useToast();
  const isEditing = !!initialData;

  const form = useForm<InsertRatingCriteria>({
    resolver: zodResolver(insertRatingCriteriaSchema),
    defaultValues: {
      key: initialData?.key || "",
      name: initialData?.name || "",
      description: initialData?.description || "",
      isActive: initialData?.isActive ?? true,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertRatingCriteria) => {
      const response = await apiRequest("POST", "/api/rating-criteria", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rating-criteria"] });
      toast({
        title: "Success",
        description: "Rating criteria created successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create rating criteria",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: InsertRatingCriteria) => {
      const response = await apiRequest("PUT", `/api/rating-criteria/${initialData!.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/rating-criteria"] });
      toast({
        title: "Success",
        description: "Rating criteria updated successfully",
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update rating criteria",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertRatingCriteria) => {
    if (isEditing) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const isLoading = createMutation.isPending || updateMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Luminosity" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="key"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Key</FormLabel>
              <FormControl>
                <Input 
                  placeholder="luminosity" 
                  {...field}
                  disabled={isEditing}
                />
              </FormControl>
              {isEditing && (
                <p className="text-xs text-gray-500">Key cannot be changed after creation</p>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Natural and artificial lighting quality"
                  className="min-h-[80px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Active</FormLabel>
                <div className="text-sm text-gray-500">
                  Whether this rating criteria should be available for use
                </div>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button 
            type="submit" 
            disabled={isLoading}
          >
            {isLoading 
              ? (isEditing ? "Updating..." : "Creating...") 
              : (isEditing ? "Update Criteria" : "Create Criteria")
            }
          </Button>
        </div>
      </form>
    </Form>
  );
}
