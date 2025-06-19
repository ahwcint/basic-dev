"use client";

import { UserRole } from "@/lib/api/type";
import { usePathname } from "next/navigation";
import type { PropsWithChildren, ReactNode } from "react";
import { Button } from "../../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";

type NavigationListProp = {
  data: {
    to?: string;
    active?: string;
    onClick?: () => void;
    label: ReactNode;
    className?: string;
    rolesAccess?: UserRole[];
  }[];
  currentRole: UserRole;
};

export function NavigationList({ data, currentRole }: NavigationListProp) {
  const pathname = usePathname();
  return (
    <ul className="h-full flex flex-col gap-1 *:flex *:gap-1 *:items-center">
      <li className="capitalize font-bold p-4 text-2xl">{currentRole}</li>
      {data.map((i, ind) =>
        i.rolesAccess?.includes(currentRole) || !i.rolesAccess ? (
          <li className={i.className} key={`${ind}-item-nav`}>
            <ButtonCustom
              onClick={i.onClick}
              active={pathname.startsWith(`/${i.active}`)}
              href={i.to}
            >
              {i.label}
            </ButtonCustom>
          </li>
        ) : null
      )}
    </ul>
  );
}

const ButtonCustom = ({
  children,
  active = false,
  href = "",
  onClick,
}: PropsWithChildren & {
  active?: boolean;
  href?: string;
  onClick?: () => void;
}) => (
  <Button
    asChild
    onClick={onClick}
    variant={"ghost"}
    className={cn(
      "w-full flex justify-start py-[1.3rem]",
      active && "!bg-blue-100"
    )}
  >
    <Link href={href} className="w-full">
      {children}
    </Link>
  </Button>
);
