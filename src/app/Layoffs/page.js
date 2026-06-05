"use client"
import AppSidebar from "@/components/AppSidebar";
import AuthGate from "@/components/AuthGate";
import LayoffPage from "@/pages/LayoffPage";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layoffs() {
  return (
    <SidebarProvider>
    <div className="flex w-full h-full">
        <AppSidebar />
      <main className="flex-1 flex flex-row w-full p-4 m-10 mt-4">
        <AuthGate>
          <LayoffPage />
        </AuthGate>
      </main>
    </div>
    </SidebarProvider>
  );
}
