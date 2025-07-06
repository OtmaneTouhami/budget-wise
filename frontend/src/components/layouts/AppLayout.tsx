import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  return (
    <div className="flex bg-background">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
