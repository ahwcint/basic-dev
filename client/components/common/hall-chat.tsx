'use client';

import { CardMessage } from '@/components/common/cards/card-message';
import { BaseFormField } from '@/components/common/form/base-form-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SocketRooms } from '@/hooks/use-socket/type';
import { useAuth } from '@/lib/context/auth-context';
import { ChevronDownIcon, SendHorizonalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '../ui/scroll-area';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn, isScrolledToBottom } from '@/lib/utils';
import { useJoinRoom, useSocket } from '@/hooks/use-socket/socket';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';

type Chat = {
  msg: string;
  id: string;
  sender: string | undefined;
  createdAt: number;
  system?: boolean;
};
type FormType = { text: string };

export function HallChat() {
  const { user } = useAuth();
  const socket = useSocket();
  useJoinRoom(SocketRooms.HALL_CHAT);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isUserNearBottomRef = useRef<boolean>(true);
  const [chat, setChat] = useState<Chat[]>([]);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(!isUserNearBottomRef.current);

  const form = useForm<FormType>({
    defaultValues: { text: '' },
    resolver: zodResolver(
      z.object({
        text: z.string().trim().min(1),
      }),
    ),
  });

  const handleScrollLastMsg = useCallback(() => {
    const el = viewportRef.current;
    if (!el) return;
    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, []);

  const handleStoreChat = useCallback(
    (res: Chat) => {
      if (!res.msg) return;
      setChat((prev) => {
        const result = [...prev, res];
        if (result.length > 50) result.shift();
        return result;
      });
      if (isUserNearBottomRef.current) setTimeout(handleScrollLastMsg, 100);
    },
    [handleScrollLastMsg],
  );

  const handleSendMsg = (data: FormType) => {
    const payload = {
      id: `${Date.now()}-${user?.username}`,
      msg: data.text,
      sender: user?.username,
      createdAt: Date.now(),
    };
    handleStoreChat(payload);
    socket.emit(SocketRooms.HALL_CHAT, payload);
    form.reset();
  };

  useEffect(() => {
    socket.on('message', handleStoreChat);
    return () => {
      socket.off('message', handleStoreChat);
    };
  }, [handleStoreChat, socket]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    const handleScroll = () => {
      const nearBottom = isScrolledToBottom(el, 100);
      isUserNearBottomRef.current = nearBottom;
      setShowScrollDownBtn(!nearBottom);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <>
      <div className="grow flex gap-2">
        <Card className="rounded-lg p-0 grow overflow-hidden relative">
          <ScrollArea
            className="size-full p-3 *:data-[slot=scroll-area-viewport]:*:!block"
            viewportRef={viewportRef}
          >
            <div className="flex flex-col gap-2">
              {chat.map((i, index) => (
                <CardMessage key={`${i.id}-${index}`} {...i} />
              ))}
            </div>
          </ScrollArea>
          <ScrollDownBtn onClick={handleScrollLastMsg} open={showScrollDownBtn} />
        </Card>
        <Card className="w-[36px] rounded-lg items-center">
          <Avatar>
            <Tooltip>
              <AvatarFallback>
                <TooltipTrigger>hi</TooltipTrigger>
              </AvatarFallback>
              <TooltipContent side={'left'}>test</TooltipContent>
            </Tooltip>
          </Avatar>
        </Card>
      </div>
      <form
        className="h-fit flex flex-row gap-2 *:data-[slot=form-item]:gap-0"
        onSubmit={form.handleSubmit(handleSendMsg)}
      >
        <Form {...form}>
          <BaseFormField
            className="grow"
            name="text"
            formControl={form.control}
            render={({ field }) => <Input {...field} placeholder=". . . ." />}
            noMessageError
          />
          <Button size="icon" type="submit">
            <SendHorizonalIcon />
          </Button>
        </Form>
      </form>
    </>
  );
}

function ScrollDownBtn({ onClick, open = false }: { onClick?: () => void; open?: boolean }) {
  return (
    <Button
      size="icon"
      onClick={onClick}
      className={cn(
        'rounded-full absolute bottom-0 left-1/2 size-7 opacity-0 -translate-x-1/2 my-2',
        open && 'delay-500 opacity-100',
      )}
    >
      <ChevronDownIcon />
    </Button>
  );
}
