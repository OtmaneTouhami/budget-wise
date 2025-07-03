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
import { useChangePassword } from "@/api/generated/hooks/user-profile/user-profile";
import { changePasswordBody } from "@/api/generated/zod/user-profile/user-profile";
import type { ApiErrorResponse } from "@/types/error";


const passwordSchema = changePasswordBody.extend({
    // We already have newPassword, just add confirm
    confirmationPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmationPassword, {
    message: "New passwords do not match",
    path: ["confirmationPassword"],
});
type PasswordSchema = z.infer<typeof passwordSchema>;

export const ChangePasswordForm = () => {
    const changePasswordMutation = useChangePassword();

    const form = useForm<PasswordSchema>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmationPassword: "",
        },
    });

    const onSubmit = async (values: PasswordSchema) => {
        try {
            await changePasswordMutation.mutateAsync({ data: values });
            toast.success("Password changed successfully!");
            form.reset();
        } catch (error) {
            const apiError = error as { data: ApiErrorResponse };
            toast.error(apiError.data?.message || "Failed to change password.");
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Change Password</CardTitle>
                <CardDescription>
                    Choose a new password for your account.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmationPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl><Input type="password" {...field} /></FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" disabled={changePasswordMutation.isPending}>
                            {changePasswordMutation.isPending ? "Updating..." : "Update Password"}
                        </Button>
                    </form>
                </Form>
            </CardContent>
        </Card>
    );
}