import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { PropsWithChildren } from 'react';

export function CardMessage(props: {
  msg: string;
  id: string;
  sender: string | undefined;
  createdAt: number;
}) {
  return (
    <div className="flex items-start">
      <Avatar className="size-12 shrink-0">
        <AvatarFallback>{props.sender?.slice(0, 3).toUpperCase()}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col grow overflow-hidden">
        <TextMessage className="font-bold">
          {props.sender}
          <span className="text-secondary font-mono text-[0.7rem] hover:text-primary cursor-default ml-1">
            {format(props.createdAt, 'hh:mm aa')}
          </span>
        </TextMessage>
        <TextMessage className="">{props.msg}</TextMessage>
      </div>
    </div>
  );
}

function TextMessage({ children, className }: PropsWithChildren & { className?: string }) {
  return <span className={cn('min-w-5 px-2 break-words', className)}>{children}</span>;
}
