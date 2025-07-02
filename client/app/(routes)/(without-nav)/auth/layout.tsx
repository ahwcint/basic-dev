import { type PropsWithChildren } from 'react';
import { PrefetchRoutes } from './prefetch';

export default function LayoutWithOutNavigation({ children }: PropsWithChildren) {
  return (
    <>
      <PrefetchRoutes />
      <main className="w-full">{children}</main>
    </>
  );
}
