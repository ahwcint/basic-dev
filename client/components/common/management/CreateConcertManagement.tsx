import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { BaseFormField } from "../form/BaseFormField";
import { Textarea } from "@/components/ui/textarea";
import { SaveIcon, UserIcon } from "lucide-react";
import { Button } from "@/components/ui/custom-button";
import { inputGuardNumber } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { useCreateConcert } from "@/lib/hooks/concert/useCreateConcert";
import { useQueryClient } from "@tanstack/react-query";

const formValidation = z.object({
  name: z.string().min(1),
  totalSeats: z.coerce.number().min(1),
  description: z.string().min(1),
});

type FormDto = z.infer<typeof formValidation>;

export function CreateConcertManagement() {
  const queryClient = useQueryClient();
  const { mutate, isPending } = useCreateConcert({
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ["list-concert"] });
      toast.success(res.message);
      form.reset();
    },
  });

  const form = useForm({
    defaultValues: {
      name: "",
      totalSeats: 0,
      description: "",
    },
    resolver: zodResolver(formValidation),
    disabled: isPending,
  });

  const onSubmit = (data: FormDto) => {
    if (!isPending) mutate(data);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-custom-blue text-2xl">Create</CardTitle>
        </CardHeader>
        <CardContent className="relative">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid grid-cols-[repeat(2,1fr)] gap-2"
            >
              <BaseFormField
                formControl={form.control}
                label="Concert Name"
                name="name"
                render={({ field }) => (
                  <Input {...field} placeholder="Please input concert name." />
                )}
              />
              <BaseFormField
                formControl={form.control}
                label="Total of seat"
                name="totalSeats"
                render={({ field }) => (
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Please input total of seat."
                      type="number"
                      onChange={inputGuardNumber(field.onChange)}
                      inputMode="numeric"
                      className="pr-[2.3rem] appearance-none [-moz-appearance:textfield] "
                    />
                    <UserIcon className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  </div>
                )}
              />
              <BaseFormField
                className="col-[1/-1]"
                formControl={form.control}
                label="Description"
                name="description"
                render={({ field }) => (
                  <Textarea
                    {...field}
                    className="resize-none"
                    placeholder="Please input description."
                  />
                )}
              />
              <div className="col-[2]">
                <Button
                  type="submit"
                  variant={'action'}
                  className="float-right"
                  loading={isPending}
                  startIcon={<SaveIcon />}
                >
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}
