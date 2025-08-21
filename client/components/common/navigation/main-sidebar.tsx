'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { PropsWithChildren } from 'react';
import { AppSelection } from './app-selection';
import { FooterSidebar } from './footer-sidebar';
import { useAuth } from '@/lib/context/auth-context';
import { CustomTooltip } from '../custom-tool-tip';
import { useRouter } from 'next/navigation';
import { sidebarMenuItems } from './data/sidebar-menu-data';

export function MainSideBarWrapper({ children }: PropsWithChildren) {
  return (
    <SidebarProvider open={false} className="flex">
      <MainSideBar>{children}</MainSideBar>
    </SidebarProvider>
  );
}

function MainSideBar({ children }: PropsWithChildren) {
  const { isMobile } = useSidebar();
  const { token } = useAuth();

  return (
    <>
      {token && <AppSideBar isMobile={isMobile} />}
      {children}
      {isMobile && <SidebarTrigger className="mt-2 absolute top-0 right-2" size="lg" />}
    </>
  );
}

function AppSideBar({ isMobile }: { isMobile: boolean }) {
  const router = useRouter();

  return (
    <Sidebar className="relative" variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <AppSelection isMobile={isMobile} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                {sidebarMenuItems.map((item, index) => (
                  <SidebarMenuButton
                    key={item.title + index}
                    onClick={() => router.replace(item.href)}
                  >
                    <CustomTooltip content={item.title} side="right" asChild>
                      {item.icon}
                    </CustomTooltip>
                  </SidebarMenuButton>
                ))}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <FooterSidebar isMobile={isMobile} />
      </SidebarFooter>
    </Sidebar>
  );
}
