"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/context/AuthContext";
import { createUserService, listUserService } from "@/services/auth.service";

export default function Home() {
  const auth = useAuth();
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Label>Welcome back, {auth.user}</Label>
      <Button onClick={() => auth.logout(true)}>logout</Button>
      <Button onClick={() => createUserService("aumer2")}>create user</Button>
      <Button onClick={() => listUserService()}>list user</Button>
    </div>
  );
}
