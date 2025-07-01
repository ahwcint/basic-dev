"use client";

import { Button } from "@/components/ui/custom-button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/context/AuthContext";
import { BaseFormField } from "@/components/common/form/BaseFormField";
import { useRouter } from "next/navigation";

const registerSchema = z.object({
  username: z.string().min(1).max(20),
  password: z.string().min(1).max(20),
});

type registerDto = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = (values: registerDto) => {
    register({
      payload: values,
      onSettled: () => router.replace("/home"),
    });
  };
  return (
    <div className="p-1 h-full flex justify-center items-center">
      <Card className="max-w-md w-full">
        <CardHeader>Register</CardHeader>
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
                  <Input
                    {...field}
                    type="password"
                    placeholder="PASSWORD"
                    autoComplete="off"
                  />
                )}
              />
              <Button type="submit" className="float-right">
                Create
              </Button>
              <Button
                type="button"
                variant={"link"}
                className="float-right mx-2"
                onClick={() => router.push("/auth/login")}
              >
                back to login
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
