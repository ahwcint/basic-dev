'use client';

import { BaseContainer } from '@/components/common/base-container';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export default function HomePage() {
  return (
    <BaseContainer className={cn('h-full flex flex-col gap-2 p-2')}>
      <Card className="rounded-lg h-full p-5">hi</Card>
      <Card className="rounded-lg h-[3rem]">typing ground</Card>
    </BaseContainer>
  );
}
