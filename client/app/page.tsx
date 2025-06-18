"use client";

import { Button } from "@/components/ui/button";
import { createUserService, listUserService } from "@/services/auth.service";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <Button onClick={() => createUserService("aumer2")}>create user</Button>
      <Button onClick={() => listUserService()}>list user</Button>
    </div>
  );
}
