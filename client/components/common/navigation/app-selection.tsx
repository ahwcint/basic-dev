import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/components/ui/sidebar";
import { ChevronsUpDownIcon } from "lucide-react";
import { useMemo } from "react";

export function AppSelection({ isMobile }: { isMobile: boolean }) {
  const side = useMemo(() => {
    return isMobile ? undefined : "right";
  }, [isMobile]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="font-mono h-12">
        <SidebarMenuButton isActive size={"lg"}>
          <Avatar className="rounded-sm">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <ChevronsUpDownIcon className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-[var(--radix-popper-anchor-width)]"
        side={side}
        align="start"
      >
        <DropdownMenuLabel className="text-muted-foreground text-[0.7rem] font-extrabold">
          Apps
        </DropdownMenuLabel>
        <DropdownMenuGroup className="**:data-[slot=dropdown-menu-item]:cursor-pointer">
          <DropdownMenuItem>Todo</DropdownMenuItem>
          <DropdownMenuItem>Jari</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
