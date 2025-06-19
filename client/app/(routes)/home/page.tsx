"use client";

import { useAuth } from "@/lib/context/AuthContext";

export default function HomePage() {
  const auth = useAuth();
  return <>hello &quot;{auth.user?.username}&quot;</>;
}
