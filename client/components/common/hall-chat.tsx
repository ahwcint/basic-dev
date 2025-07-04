'use client';

import { CardMessage } from '@/components/common/cards/card-message';
import { BaseFormField } from '@/components/common/form/BaseFormField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SocketRooms } from '@/hooks/use-socket/type';
import { useAuth } from '@/lib/context/AuthContext';
import { ChevronDownIcon, SendHorizonalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { ScrollArea } from '../ui/scroll-area';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn, isScrolledToBottom } from '@/lib/utils';
import { useJoinRoom, useSocket } from '@/hooks/use-socket/socket';

type Chat = {
  msg: string;
  id: string;
  sender: string | undefined;
  createdAt: number;
  system?: boolean;
};
type FormType = { text: string };

export function HallChat() {
  const socket = useSocket();
  useJoinRoom(SocketRooms.HALL_CHAT);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isUserNearBottomRef = useRef<boolean>(true);
  const [chat, setChat] = useState<Chat[]>([]);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(!isUserNearBottomRef.current);
  const { user } = useAuth();

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
    socket?.emit('send-hall-chat', payload);
    form.reset();
  };

  useEffect(() => {
    if (!socket) return;

    socket.on('receive-hall-chat', handleStoreChat);
    return () => {
      socket.off('receive-hall-chat', handleStoreChat);
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
      <Card className="rounded-lg p-0 grow overflow-hidden">
        <ScrollArea
          className="size-full p-3 *:data-[slot=scroll-area-viewport]:*:!block"
          viewportRef={viewportRef}
        >
          <div className="flex flex-col gap-2">
            <ScrollDownBtn onClick={handleScrollLastMsg} open={showScrollDownBtn} />
            {chat.map((i, index) => (
              <CardMessage key={`${i.id}-${index}`} {...i} />
            ))}
          </div>
        </ScrollArea>
      </Card>
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
        'rounded-full absolute bottom-0 right-50 m-2 size-7 -translate-x-1/2 opacity-0',
        open && 'delay-1000 opacity-100',
      )}
    >
      <ChevronDownIcon />
    </Button>
  );
}
