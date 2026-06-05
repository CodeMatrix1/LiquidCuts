"use client";
import React, { useState } from "react";
import HomePage from "@/views/home";
import AppSidebar from "@/components/AppSidebar";
import AuthGate from "@/components/AuthGate";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
        <div className="flex w-full h-full">
              <AppSidebar />
              <main className="flex-1 flex flex-row w-full p-4 m-10 mt-4">
                <AuthGate>
                  <HomePage />
                </AuthGate>
              </main>
            </div>
    </SidebarProvider>
  );
}
