import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

export function ComponentLoading({ className }: { className?: string }) {
  return (
    <div className={cn('size-full', className)}>
      <Skeleton className="size-full" />
    </div>
  );
}
