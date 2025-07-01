import { MainSideBarWrapper } from "@/components/common/navigation/main-sidebar";
import type { PropsWithChildren } from "react";

export default function LayoutWithNavigation({ children }: PropsWithChildren) {
  return (
    <>
      <MainSideBarWrapper>
        <main className="w-full max-w-7xl mx-auto">{children}</main>
      </MainSideBarWrapper>
    </>
  );
}
