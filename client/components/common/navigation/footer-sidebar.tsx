import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { LogOutIcon, SettingsIcon, SunMoonIcon, UserCogIcon } from 'lucide-react';
import { useAuth } from '@/lib/context/auth-context';
import { useMemo } from 'react';
import { ButtonModeToggle } from '../mode-toggle';

export function FooterSidebar({ isMobile }: { isMobile: boolean }) {
  const { logout, user } = useAuth();
  const side = useMemo(() => {
    return isMobile ? undefined : 'right';
  }, [isMobile]);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="font-mono h-12">
        <SidebarMenuButton isActive size={'lg'}>
          <Avatar className="rounded-sm">
            <AvatarFallback>{user.username.slice(0, 2)}</AvatarFallback>
          </Avatar>
          <SettingsIcon className="ml-auto" />
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[var(--radix-popper-anchor-width)]" side={side} align="end">
        <DropdownMenuLabel className="text-muted-foreground text-[0.7rem] font-extrabold">
          Settings
        </DropdownMenuLabel>
        <DropdownMenuGroup className="**:data-[slot=dropdown-menu-item]:cursor-pointer">
          <DropdownMenuItem>
            <UserCogIcon /> Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-muted-foreground text-[0.7rem] font-extrabold">
            System
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <SunMoonIcon />
            <ButtonModeToggle />
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => logout(true)} variant="destructive">
            <LogOutIcon />
            Logout
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
