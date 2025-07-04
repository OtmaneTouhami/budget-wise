import { NavLinks } from "./NavLinks";
import { UserProfileMenu } from "@/features/auth/components/UserProfileMenu";
import { Separator } from "../ui/separator";

export const Sidebar = () => {
  return (
    <aside className="hidden w-64 flex-col border-r bg-background p-4 md:flex">
        <div className="flex-1">
            <div className="mb-4 flex items-center gap-2 px-2">
                <h1 className="text-xl font-bold">BudgetWise+</h1>
            </div>
            <NavLinks />
        </div>
        <div className="mt-auto">
            <Separator className="my-2" />
            <UserProfileMenu />
        </div>
    </aside>
  )
}
