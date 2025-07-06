import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";

export const AppLayout = () => {
  return (
    // The main container just needs to be a flexbox. The sidebar and main content
    // will handle their own scrolling and height.
    <div className="flex bg-background">
      <Sidebar />
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
};
