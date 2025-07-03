// --- File: frontend/src/features/user/components/DeleteAccountSection.tsx ---
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuthStore } from "@/store/auth-store";
import { useDeleteUserProfile } from "@/api/generated/hooks/user-profile/user-profile";
import type { ApiErrorResponse } from "@/types/error";

export const DeleteAccountSection = () => {
    const navigate = useNavigate();
    const deleteMutation = useDeleteUserProfile();
    const authStoreLogout = useAuthStore((state) => state.logout);

    const handleDelete = async () => {
        try {
            await deleteMutation.mutateAsync();
            toast.success("Your account has been deleted.");
            authStoreLogout();
            navigate("/login");
        } catch (error) {
            const apiError = error as { data: ApiErrorResponse };
            toast.error(apiError.data?.message || "Failed to delete account.");
        }
    }

    return (
        <Card className="border-destructive">
            <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                    Permanently delete your account and all associated data. This action
                    cannot be undone.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" disabled={deleteMutation.isPending}>
                            {deleteMutation.isPending ? "Deleting..." : "Delete My Account"}
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action is permanent and cannot be reversed. All your data,
                                including transactions, budgets, and categories, will be lost forever.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete} className="bg-destructive hover:bg-destructive/90">
                                Yes, delete my account
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardContent>
        </Card>
    );
};