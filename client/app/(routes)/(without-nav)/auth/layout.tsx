import type { PropsWithChildren } from "react";

export default function LayoutWithOutNavigation({
  children,
}: PropsWithChildren) {
  return (
    <>
      <main className="w-full">{children}</main>
    </>
  );
}
