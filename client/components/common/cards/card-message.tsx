import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

export function CardMessage(props: {
  msg: string;
  id: string;
  sender: string | undefined;
  username: string;
}) {
  const isMe = props.username === props.sender;

  if (isMe)
    return (
      <div className={cn('inline-flex gap-1 flex-row-reverse')}>
        <span className="bg-muted rounded-xl min-w-5 px-2 py-1">{props.msg}</span>
      </div>
    );

  return (
    <div className={cn('inline-flex gap-1')}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Avatar>
            <AvatarFallback>{props.sender?.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TooltipTrigger>
        <TooltipContent>
          <p>{props.sender}</p>
        </TooltipContent>
      </Tooltip>
      <span className="bg-muted rounded-xl min-w-5 px-2 py-1">{props.msg}</span>
    </div>
  );
}
