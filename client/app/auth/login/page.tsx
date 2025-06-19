"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createUserService } from "@/services/auth.service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/context/AuthContext";
import { useEffect, useRef } from "react";

const loginSchema = z.object({
  username: z.string().min(1).max(20),
});

type loginDto = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const auth = useAuth();
  const isRun = useRef(false);
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values: loginDto) => {
    const user = await auth.login(values.username);
    if (user.success) {
      toast.success(user.message);
      router.refresh();
      return;
    }

    const newUser = await createUserService(values.username);

    if (newUser.success) {
      toast.success(newUser.message);
      router.refresh();
    }
  };

  useEffect(() => {
    if (isRun.current) return;
    isRun.current = true;

    if (auth.user) auth.setUser(undefined);
  }, [auth]);
  return (
    <div className="p-1 bg-gray-300 h-full flex justify-center items-center">
      <Card className="max-w-md w-full">
        <CardHeader>Login</CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder="USERNAME" {...field} />
                    </FormControl>
                    <FormDescription />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="float-right">
                Login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
