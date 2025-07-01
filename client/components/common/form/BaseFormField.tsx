import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { ReactNode } from "react";
import type {
  Control,
  ControllerRenderProps,
  FieldValues,
  Path,
} from "react-hook-form";

export function BaseFormField<F extends FieldValues = object>({
  formControl,
  label = "",
  name,
  render = () => null,
  className,
}: {
  formControl: Control<F, unknown, F>;
  label?: string;
  className?: string;
  name: Path<F>;
  render: (prop: { field: ControllerRenderProps<F, Path<F>> }) => ReactNode;
}) {
  if (!formControl) throw new Error("formControl missing.");
  return (
    <FormField
      control={formControl}
      name={name}
      render={({ field }) => (
        <FormItem className={className}>
          <FormLabel>{label}</FormLabel>
          <FormControl>{render({ field })}</FormControl>
          <FormDescription />
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
