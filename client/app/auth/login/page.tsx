"use client";

import { Button } from "@/components/ui/button";
import { createUserService, loginService } from "@/services/auth.service";

export default function LoginPage() {
  return (
    <div>
      Login Page
      <Button onClick={() => loginService("aumer")}>hi</Button>
      <Button onClick={() => createUserService("aumer")}>hi2</Button>
    </div>
  );
}
