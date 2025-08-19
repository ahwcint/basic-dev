'use client';

import { CardMessage } from '@/components/common/cards/card-message';
import { BaseFormField } from '@/components/common/form/base-form-field';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { SocketRooms } from '@/hooks/use-socket/type';
import { useAuth } from '@/lib/context/auth-context';
import { ChevronDownIcon, SendHorizonalIcon as SendHorizontalIcon } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { ScrollArea, ScrollBar } from '../ui/scroll-area';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { cn, isScrolledToBottom } from '@/lib/utils';
import { useJoinRoom, useSocket } from '@/hooks/use-socket/socket';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Tooltip, TooltipContent, TooltipTrigger } from '../ui/tooltip';
import { User } from '@/services/types/user.type';

type Chat = {
  msg: string;
  id: string;
  sender: string | undefined;
  createdAt: number;
  system?: boolean;
};

const formSchema = z.object({
  input: z.string().trim().min(0).max(200).default(''),
});

const initialValues = formSchema.parse({});

type FormType = z.infer<typeof formSchema>;

export function HallChat() {
  const { user } = useAuth();
  const socket = useSocket();
  useJoinRoom(SocketRooms.HALL_CHAT);

  const viewportRef = useRef<HTMLDivElement | null>(null);
  const isUserNearBottomRef = useRef<boolean>(true);
  const [chat, setChat] = useState<Chat[]>([]);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [showScrollDownBtn, setShowScrollDownBtn] = useState(!isUserNearBottomRef.current);

  const form = useForm<FormType>({
    defaultValues: initialValues,
    resolver: zodResolver(formSchema) as Resolver<FormType>,
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
      msg: data.input,
      sender: user?.username,
      createdAt: Date.now(),
    };
    handleStoreChat(payload);
    socket.emit(SocketRooms.HALL_CHAT, payload);
    form.reset();
  };

  const scrollDownHandler = useCallback((el: HTMLDivElement | null) => {
    if (!el) return;
    const handleScroll = () => {
      const nearBottom = isScrolledToBottom(el, 100);
      isUserNearBottomRef.current = nearBottom;
      setShowScrollDownBtn(!nearBottom);
    };

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleListActiveUser = (users: User[]) => {
      const usersWithoutMe = users.filter((v) => v.id !== user.id);
      setActiveUsers(usersWithoutMe);
    };

    socket.on(SocketRooms.MSG, handleStoreChat);

    socket.on(SocketRooms.ACTIVE_USER, handleListActiveUser);
    return () => {
      socket.off(SocketRooms.ACTIVE_USER, handleListActiveUser);
      socket.off(SocketRooms.MSG, handleStoreChat);
    };
  }, [handleStoreChat, socket, user]);

  useEffect(() => {
    const el = viewportRef.current;
    return scrollDownHandler(el);
  }, [scrollDownHandler]);
  return (
    <>
      <Card className="p-0 grow overflow-hidden relative bg-transparent">
        <ScrollArea
          className="size-full p-3 *:data-[slot=scroll-area-viewport]:*:!block"
          viewportRef={viewportRef}
        >
          <div className="flex flex-col gap-2 pt-10">
            {chat.map((i, index) => (
              <CardMessage key={`${i.id}-${index}`} {...i} />
            ))}
          </div>
        </ScrollArea>
        <ScrollDownBtn onClick={handleScrollLastMsg} open={showScrollDownBtn} />
        <DisplayUserOnline data={activeUsers} />
      </Card>
      <form
        className="h-fit flex flex-row gap-2 *:data-[slot=form-item]:gap-0"
        onSubmit={form.handleSubmit(handleSendMsg)}
      >
        <Form {...form}>
          <BaseFormField
            className="grow"
            name="input"
            formControl={form.control}
            render={({ field }) => (
              <div className="relative">
                <Input
                  {...field}
                  placeholder="Type a message..."
                  maxLength={200}
                  className="rounded-full pr-[4rem]"
                />
                <span
                  className={`absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 pointer-events-none ${field.value.length === 200 ? 'text-red-500' : ''}`}
                >
                  {field.value.length || 0}/{200}
                </span>
              </div>
            )}
            noMessageError
          />
          <Button
            size="icon"
            type="submit"
            onMouseDown={(e) => e.preventDefault()}
            className="rounded-full"
          >
            <SendHorizontalIcon className="-rotate-45" />
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

function DisplayUserOnline<T extends Record<string, string>[]>({ data }: { data: T }) {
  return (
    <Card
      className="rounded-full m-1 absolute right-0 top-0 p-0 max-w-[calc(80%-0.50rem)] overflow-hidden !glass-morphism"
      hidden={!data.length}
    >
      <ScrollArea className="size-full">
        <div className="flex gap-1 p-1">
          {data.map((user) => (
            <Avatar key={`tab-list-${user.id}`}>
              <Tooltip>
                <AvatarFallback>
                  <TooltipTrigger className="cursor-default">
                    {user.username.slice(0, 2)}
                  </TooltipTrigger>
                </AvatarFallback>
                <TooltipContent side={'bottom'}>{user.username}</TooltipContent>
              </Tooltip>
            </Avatar>
          ))}
        </div>
        <ScrollBar orientation="horizontal" hidden />
      </ScrollArea>
    </Card>
  );
}
