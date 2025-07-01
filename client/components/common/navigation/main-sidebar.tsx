"use client";

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
} from "@/components/ui/sidebar";
import { PropsWithChildren } from "react";
import { AppSelection } from "./app-selection";
import { FooterSidebar } from "./footer-sidebar";
import { SettingsIcon } from "lucide-react";

export function MainSideBar({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <SidebarTrigger className="mt-2" />
      {children}
    </SidebarProvider>
  );
}

function AppSideBar() {
  const { isMobile } = useSidebar();
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
