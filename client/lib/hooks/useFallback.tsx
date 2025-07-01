import { ReactNode, useCallback, useMemo } from "react";
import { BadResponse } from "../api/type";
import { CircleXIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type FallbackVariant = "multi" | "single";

type fallbackProp = {
  isLoading: boolean;
  isError: boolean;
  error: BadResponse | null | Error;
  variant?: FallbackVariant;
};

export function useFallback({
  isLoading,
  isError,
  error,
  variant = "multi",
}: Partial<fallbackProp>) {
  const fallbackVariant = useCallback(() => {
    switch (variant) {
      case "single":
        return (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-full h-[20rem]" />
          </div>
        );
      case "multi":
      default:
        return (
          <div className="flex flex-col gap-5">
            <Skeleton className="w-full h-[10rem]" />
            <Skeleton className="w-full h-[10rem]" />
            <Skeleton className="w-full h-[10rem]" />
          </div>
        );
    }
  }, [variant]);
  let fallbackRender: ReactNode = useMemo(
    () => fallbackVariant(),
    [fallbackVariant]
  );

  const isFallback = isLoading || isError;

  if (isError)
    fallbackRender = (
      <span className="text-gray-500 m-auto h-[3rem]">
        <CircleXIcon className="block m-auto" />
        {error?.message || "Unexpected Error."}
      </span>
    );

  return {
    isFallback,
    fallback: fallbackRender,
  };
}
