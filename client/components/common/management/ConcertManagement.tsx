"use client";
import { ComponentProps, useEffect, useState } from "react";
import { BaseContainer } from "../base-container";
import { cn } from "@/lib/utils";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ConcertInformation } from "./ConcertInformation";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CreateConcertManagement } from "./CreateConcertManagement";
import { RoleGuard } from "@/lib/guard/RoleGuard";
import { UserRole } from "@/services/types/user.type";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";
import { useFallback } from "@/lib/hooks/useFallback";

enum TabsContentValue {
  OVERVIEW = "overview",
  CREATE = "create",
}

function ConcertManagement({
  className,
  ...prop
}: ComponentProps<typeof BaseContainer>) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [tab, setTab] = useState<TabsContentValue | null>(null);

  const createSearchQuery = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  const handleChangeTab = (targetTab: TabsContentValue) => {
    return () => {
      router.replace(`${pathname}?${createSearchQuery("tab", targetTab)}`);
    };
  };

  useEffect(() => {
    const currentTab = searchParams.get("tab");

    if (
      currentTab &&
      Object.values(TabsContentValue).includes(currentTab as TabsContentValue)
    ) {
      setTab(currentTab as TabsContentValue);
    } else {
      setTab(TabsContentValue.OVERVIEW);
    }
  }, [searchParams]);

  const { fallback } = useFallback({ isLoading: !tab });
  if (!tab) return fallback;

  return (
    <BaseContainer className={cn("px-0", className)} {...prop}>
      <Tabs value={tab} className="h-full">
        <ScrollArea className="h-full py-2" scrollHideDelay={500}>
          <div className="sticky top-0 left-0 bg-transparent backdrop-blur-sm rounded-2xl px-1 z-10">
            <TabsList className="gap-3">
              <TabsTrigger
                value={TabsContentValue.OVERVIEW}
                onClick={handleChangeTab(TabsContentValue.OVERVIEW)}
              >
                Overview
              </TabsTrigger>
              <TabsTrigger
                value={TabsContentValue.CREATE}
                onClick={handleChangeTab(TabsContentValue.CREATE)}
              >
                Create
              </TabsTrigger>
            </TabsList>
          </div>
          <TabsContent
            value={TabsContentValue.OVERVIEW}
            className="gap-5 flex flex-col py-4"
          >
            <ConcertInformation />
          </TabsContent>
          <TabsContent value={TabsContentValue.CREATE} className="py-4">
            <CreateConcertManagement />
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </BaseContainer>
  );
}

/**
 * @access ADMIN
 */
export function ConcertManagementWrapper(
  props: ComponentProps<typeof ConcertManagement>
) {
  return (
    <RoleGuard allowedRoles={[UserRole.ADMIN]}>
      <ConcertManagement {...props} />
    </RoleGuard>
  );
}
