import { ChangePasswordForm } from "@/features/user/components/ChangePasswordForm";
import { DeleteAccountSection } from "@/features/user/components/DeleteAccountSection";
import { UpdateProfileForm } from "@/features/user/components/UpdateProfileForm";
import { Separator } from "@/components/ui/separator";

export const ProfilePage = () => {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-lg font-medium">User Profile</h1>
                <p className="text-sm text-muted-foreground">
                    Manage your account settings and preferences.
                </p>
            </div>
            <Separator />
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <UpdateProfileForm />
                <div className="space-y-8">
                    <ChangePasswordForm />
                    <DeleteAccountSection />
                </div>
            </div>
        </div>
    );
}