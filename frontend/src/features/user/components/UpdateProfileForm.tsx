import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  useGetUserProfile,
  useUpdateUserProfile,
} from "@/api/generated/hooks/user-profile/user-profile";
import { updateUserProfileBody } from "@/api/generated/zod/user-profile/user-profile";
import { useAuthStore } from "@/store/auth-store";
import type { ApiErrorResponse } from "@/types/error";

const profileSchema = updateUserProfileBody;
type ProfileSchema = z.infer<typeof profileSchema>;

export const UpdateProfileForm = () => {
  const { data: userProfile, isLoading } = useGetUserProfile();
  const updateUserMutation = useUpdateUserProfile();
  const { user, login } = useAuthStore();

  const form = useForm<ProfileSchema>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      dateFormat: "",
    },
  });

  useEffect(() => {
    if (userProfile) {
      form.reset({
        firstName: userProfile.firstName,
        lastName: userProfile.lastName,
        email: userProfile.email,
        phoneNumber: userProfile.phoneNumber,
        dateFormat: userProfile.dateFormat,
      });
    }
  }, [userProfile, form]);

  const onSubmit = async (values: ProfileSchema) => {
    try {
      const updatedUser = await updateUserMutation.mutateAsync({ data: values });
      toast.success("Profile updated successfully!");
      if (user) {
        const tokens = useAuthStore.getState();
        if(tokens.accessToken && tokens.refreshToken) {
            login({accessToken: tokens.accessToken, refreshToken: tokens.refreshToken}, updatedUser);
        }
      }
    } catch (error) {
      const apiError = error as { data: ApiErrorResponse };
      toast.error(apiError.data?.message || "Failed to update profile.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your personal details here.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
                <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl><Input {...field} /></FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl><Input type="email" {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                    </FormItem>
                )}
            />
            <Button type="submit" disabled={isLoading || updateUserMutation.isPending}>
              {updateUserMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};