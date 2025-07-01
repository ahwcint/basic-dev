import { useEffect, type ReactNode } from "react";
import { useAuth } from "../context/AuthContext";
import { UserRole } from "../api/type";
import { usePathname, useRouter } from "next/navigation";

export function RoleGuard({
  allowedRoles,
  children,
  fallbackFn,
  fallbackRender,
  redirectTo,
}: {
  allowedRoles: UserRole[];
  children: ReactNode;
  fallbackRender?: () => ReactNode;
  fallbackFn?: () => void;
  redirectTo?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const isFallback = !user || !allowedRoles.includes(user.role);
  useEffect(() => {
    if (isFallback) {
      fallbackFn?.();
      if (redirectTo && pathname !== `/${redirectTo}`)
        router.push(redirectTo);
    }
  }, [fallbackFn, isFallback, pathname, redirectTo, router]);

  if (isFallback) {
    return fallbackRender?.() ?? null;
  }

  return children;
}
