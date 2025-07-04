'use client';

import { BaseContainer } from '@/components/common/base-container';
import { HallChat } from '@/components/common/hall-chat';
import { cn } from '@/lib/utils';
export default function HomePage() {
  return (
    <BaseContainer className={cn('h-full flex flex-col gap-2 p-2')}>
      <HallChat />
    </BaseContainer>
  );
}
