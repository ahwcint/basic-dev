"use client";

import { SeatsInformationWrapper } from "@/components/common/info/SeatsInfomation";
import { ConcertManagementWrapper } from "@/components/common/management/ConcertManagement";
import { BaseContainer } from "@/components/common/base-container";
import { ConcertInformation } from "@/components/common/management/ConcertInformation";
import { RoleGuard } from "@/lib/guard/RoleGuard";
import { UserRole } from "@/services/types/user.type";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function HomePage() {
  return (
    <BaseContainer className="h-full flex flex-col gap-2">
      <SeatsInformationWrapper />
      <ConcertManagementWrapper className="grow overflow-hidden" />
      <RoleGuard allowedRoles={[UserRole.USER]}>
        <ScrollArea className="h-full py-2" scrollHideDelay={500}>
          <div className="gap-5 flex flex-col">
            <ConcertInformation isViewMode />
          </div>
        </ScrollArea>
      </RoleGuard>
    </BaseContainer>
  );
}
