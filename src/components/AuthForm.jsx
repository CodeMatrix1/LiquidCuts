"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AuthForm({ mode }) {
  const router = useRouter();
  const isRegister = mode === "register";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || data.message || "Something went wrong");
        return;
      }
    } catch (error) {
      setError(error.message || "Something went wrong");
      return;
    } finally {
      setLoading(false);
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">
          {isRegister ? "Create account" : "Log in"}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {isRegister
            ? "Create your LiquidCuts account."
            : "Access your LiquidCuts dashboard."}
        </p>
      </div>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        {isRegister ? (
          <label className="flex flex-col gap-2 text-sm font-medium">
            Name
            <Input
              name="name"
              value={form.name}
              onChange={updateField}
              autoComplete="name"
              required
            />
          </label>
        ) : null}

        <label className="flex flex-col gap-2 text-sm font-medium">
          Email
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={updateField}
            autoComplete="email"
            required
          />
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium">
          Password
          <Input
            name="password"
            type="password"
            value={form.password}
            onChange={updateField}
            autoComplete={isRegister ? "new-password" : "current-password"}
            required
          />
        </label>

        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        <Button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Create account" : "Log in"}
        </Button>
      </form>

      <p className="mt-5 text-sm text-muted-foreground">
        {isRegister ? "Already have an account?" : "Need an account?"}{" "}
        <Link
          className="font-medium text-foreground underline underline-offset-4"
          href={isRegister ? "/login" : "/register"}
        >
          {isRegister ? "Log in" : "Register"}
        </Link>
      </p>
    </div>
  );
}
