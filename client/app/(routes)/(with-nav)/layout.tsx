import { MainSideBar } from "@/components/common/navigation/main-sidebar";
import type { PropsWithChildren } from "react";

export default function LayoutWithNavigation({ children }: PropsWithChildren) {
  return (
    <>
      <MainSideBar>
        <main className="w-full max-w-7xl mx-auto">
          {children}
        </main>
      </MainSideBar>
    </>
  );
}
