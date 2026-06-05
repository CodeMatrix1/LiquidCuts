"use client";

import AppSidebar from "@/components/AppSidebar";
import AuthForm from "@/components/AuthForm";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function RegisterPage() {
  return (
    <SidebarProvider>
      <div className="flex w-full h-full">
        <AppSidebar />
        <main className="flex-1 flex w-full p-4 m-10 mt-4">
          <AuthForm mode="register" />
        </main>
      </div>
    </SidebarProvider>
  );
}
