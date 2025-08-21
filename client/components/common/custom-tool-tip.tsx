import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import type { ReactNode } from 'react';

export function CustomTooltip({
  children,
  content,
  asChild,
  side,
}: {
  children: ReactNode;
  content: ReactNode;
  asChild?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild={asChild}>{children}</TooltipTrigger>
      <TooltipContent side={side}>{content}</TooltipContent>
    </Tooltip>
  );
}
