"use client";

import { HomeIcon, Inbox, LogOut, RefreshCcw } from "lucide-react";
import { useAuth } from "@/lib/context/AuthContext";
import { changeRoleUser } from "@/services/auth.service";
import { UserRole } from "@/lib/api/type";
import { toast } from "sonner";
import { NavigationList } from "./NavigationList";
import { usePathname } from "next/navigation";

export function Navigation() {
  const { logout, user, setUser } = useAuth();
  const pathname = usePathname();

  if (!user || pathname.startsWith('/auth')) return null;

  const switchRoleCase = {
    [UserRole.USER]: UserRole.ADMIN,
    [UserRole.ADMIN]: UserRole.USER,
  };

  const handleChangeRoleUser = async () => {
    const res = await changeRoleUser(user.id, switchRoleCase[user.role]);
    if (!res.success) return;

    toast.success(`${res.message} to ${res.data.role}`);
    setUser(res.data);
  };

  const handleLogOut = () => {
    logout(true);
  };

  return (
    <nav className={"h-full basis-[15rem] border-r bg-background p-1"}>
      <NavigationList
        data={[
          {
            to: "home",
            active: "home",
            rolesAccess: [UserRole.ADMIN],
            label: (
              <>
                <HomeIcon size={"1.2rem"} /> Home
              </>
            ),
          },
          {
            to: "history",
            active: "history",
            rolesAccess: [UserRole.ADMIN],
            label: (
              <>
                <Inbox size={"1.2rem"} /> History
              </>
            ),
          },
          {
            onClick: handleChangeRoleUser,
            label: (
              <>
                <RefreshCcw size={"1.2rem"} /> Switch to{" "}
                {switchRoleCase[user.role].toLowerCase()}
              </>
            ),
          },
          {
            className: "mt-auto mb-[1rem]",
            onClick: handleLogOut,
            label: (
              <>
                <LogOut size={"1.2rem"} /> Logout
              </>
            ),
          },
        ]}
        currentRole={user.role}
      />
    </nav>
  );
}
