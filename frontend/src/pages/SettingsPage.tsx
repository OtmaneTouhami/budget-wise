import { CategoryList } from "@/features/categories/components/CategoryList";
import { Separator } from "@/components/ui/separator";

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>
      <Separator />

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Categories</h2>
        <p className="text-sm text-muted-foreground">
            View, create, and manage your income and expense categories.
        </p>
        <CategoryList />
      </div>
    </div>
  );
};