import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PropsWithChildren } from 'react';

export function CardMessage(props: {
  msg: string;
  id: string;
  sender: string | undefined;
  createdAt: number;
  system?: boolean;
}) {
  if (props?.system)
    return (
      <TextMessage className="text-secondary hover:text-primary-foreground hover:bg-muted w-full text-center font-mono">
        {props.msg}
      </TextMessage>
    );
  return (
    <div className="flex items-start gap-1">
      <Avatar className="size-12 shrink-0 glass-morphism">
        <AvatarFallback className="bg-[#00000050]">
          {props.sender?.slice(0, 3).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      <div className="flex flex-col overflow-hidden rounded-3xl glass-morphism !shadow-none p-1">
        <TextMessage>{props.msg}</TextMessage>
        <TextMessage className="font-bold text-accent-foreground font-mono text-[0.7rem] hover:text-primary cursor-default ml-1 text-right opacity-50">
          {format(props.createdAt, 'hh:mm aa')}
        </TextMessage>
      </div>
    </div>
  );
}

function TextMessage({ children, className }: PropsWithChildren & { className?: string }) {
  return <span className={cn('min-w-5 px-2 break-words', className)}>{children}</span>;
}
