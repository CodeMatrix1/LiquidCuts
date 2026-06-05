"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AuthGate({ children }) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((response) => {
        if (!response.ok) {
          router.replace("/login");
          return;
        }
        setChecking(false);
      })
      .catch(() => {
        router.replace("/login");
      });
  }, [router]);

  if (checking) {
    return <div className="p-6 text-sm text-muted-foreground">Loading...</div>;
  }

  return children;
}
