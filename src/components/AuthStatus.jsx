"use client";

import { LogIn, LogOut, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export default function AuthStatus() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setUser(data?.user || null))
      .catch(() => setUser(null));
  }, []);

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });
    window.location.href = "/login";
  }

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Account</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {user ? (
            <>
              <SidebarMenuItem>
                <div className="px-2 py-1 text-sm">
                  <div className="font-medium">{user.name}</div>
                  <div className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </div>
                </div>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton onClick={logout}>
                  <LogOut />
                  <span>Log out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          ) : (
            <>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/login">
                    <LogIn />
                    <span>Log in</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="/register">
                    <UserPlus />
                    <span>Register</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
