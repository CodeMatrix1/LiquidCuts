"use client";
import React, { useState } from "react";
import HomePage from "@/pages/home";
import AppSidebar from "@/components/AppSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Home() {
  return (
    <SidebarProvider>
        <div className="flex w-full h-full">
              <AppSidebar />
              <main className="flex-1 flex flex-row w-full p-4 m-10 mt-4">
                <HomePage />
              </main>
            </div>
    </SidebarProvider>
  );
}
