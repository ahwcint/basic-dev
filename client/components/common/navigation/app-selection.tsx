import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarMenuButton } from '@/components/ui/sidebar';
import { ChevronsUpDownIcon, LayoutGrid } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { MenuItems } from './preset-data';

export function AppSelection({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();
  const side = useMemo(() => {
    return isMobile ? undefined : 'right';
  }, [isMobile]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className="font-mono h-12">
        <SidebarMenuButton isActive size={'lg'}>
          <Avatar className="rounded-sm">
            <AvatarFallback>
              <LayoutGrid />
            </AvatarFallback>
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
          {MenuItems.map((item, index) => (
            <DropdownMenuItem key={index} onClick={() => router.push(item.link)}>
              {item.icon} {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
