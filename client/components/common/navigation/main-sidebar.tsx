'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
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
import { SettingsIcon } from 'lucide-react';

export function MainSideBarWrapper({ children }: PropsWithChildren) {
  return (
    <SidebarProvider open className="flex">
      <MainSideBar>{children}</MainSideBar>
    </SidebarProvider>
  );
}

function MainSideBar({ children }: PropsWithChildren) {
  const { isMobile } = useSidebar();
  return (
    <>
      <AppSideBar isMobile={isMobile} />
      {children}
      {isMobile && <SidebarTrigger className="mt-2 absolute top-0 right-2" size="lg" />}
    </>
  );
}

function AppSideBar({ isMobile }: { isMobile: boolean }) {
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
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton>
                  <SettingsIcon />
                  Settings
                </SidebarMenuButton>
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
