'use client';

import { BaseContainer } from '@/components/common/base-container';
import { CardMessage } from '@/components/common/cards/card-message';
import { BaseFormField } from '@/components/common/form/BaseFormField';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useWebSocket } from '@/hooks/use-websocket';
import { useAuth } from '@/lib/context/AuthContext';
import { cn } from '@/lib/utils';
import { SendHorizonalIcon } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

type Chat = { msg: string; id: string; sender: string | undefined };
type FormType = { text: string };

export default function HomePage() {
  const { emit, listener } = useWebSocket();
  const [chat, setChat] = useState<Chat[]>([]);
  const { user } = useAuth();
  const form = useForm<FormType>({
    defaultValues: { text: '' },
  });

  const handleStoreChat = useCallback(
    (res: Chat) => {
      if (!res.msg) return;
      chat.push(res);
      setChat([...chat]);
    },
    [chat],
  );

  const handleSendMsg = (data: FormType) => {
    const payload = {
      id: `${Date.now()}-${user?.username}`,
      msg: data.text,
      sender: user?.username,
    };
    handleStoreChat(payload);
    emit('send-hall-chat', payload);
    form.reset();
  };

  useEffect(() => {
    listener.on('receive-hall-chat', handleStoreChat);
    return () => {
      listener.off('receive-hall-chat', handleStoreChat);
    };
  }, [handleStoreChat, listener]);
  return (
    <BaseContainer className={cn('h-full flex flex-col gap-2 p-2')}>
      <Card className="rounded-lg p-0 grow overflow-hidden">
        <div className="h-full overflow-y-auto flex flex-col-reverse p-3">
          <div className="flex flex-col gap-2">
            {chat.map((i, index) => (
              <CardMessage username={user.username} key={`${i.id}-${index}`} {...i} />
            ))}
          </div>
        </div>
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
            render={({ field }) => <Input {...field} placeholder=". . . " />}
          />
          <Button size="icon" type="submit">
            <SendHorizonalIcon />
          </Button>
        </Form>
      </form>
    </BaseContainer>
  );
}
