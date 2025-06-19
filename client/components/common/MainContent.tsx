import type { PropsWithChildren } from "react";

export function MainContent({ children }: PropsWithChildren) {
  return <main className="grow">{children}</main>;
}
