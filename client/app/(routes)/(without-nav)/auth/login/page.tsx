'use client';

import { Button } from '@/components/ui/custom-button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/context/AuthContext';
import { useState } from 'react';
import { BaseFormField } from '@/components/common/form/BaseFormField';

const loginSchema = z.object({
  username: z.string().min(1).max(20),
  password: z.string().min(1).max(20),
});

type loginDto = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
    disabled: loading,
  });

  const onSubmit = async (values: loginDto) => {
    setLoading(true);
    login({
      payload: values,
      onSuccess: () => router.refresh(),
      onSettled: () => setLoading(false),
    });
  };
  return (
    <div className="p-1 h-full flex justify-center items-center">
      <Card className="max-w-md w-full">
        <CardHeader>Login</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <BaseFormField
                formControl={form.control}
                name="username"
                render={({ field }) => (
                  <Input {...field} placeholder="USERNAME" autoComplete="off" />
                )}
              />
              <BaseFormField
                formControl={form.control}
                name="password"
                render={({ field }) => (
                  <Input {...field} type="password" placeholder="PASSWORD" autoComplete="off" />
                )}
              />
              <Button type="submit" className="float-right">
                Login
              </Button>
              <Button
                type="button"
                variant={'link'}
                className="float-right mx-2"
                onClick={() => router.push('/auth/register')}
              >
                create new one
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
