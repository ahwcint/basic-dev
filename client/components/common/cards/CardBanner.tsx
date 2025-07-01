import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

const CardColors = {
  blue: "bg-custom-blue text-white",
  red: "bg-custom-red text-white",
  green: "bg-custom-green text-white",
  default: "",
};

type CardColorsKey = keyof typeof CardColors;

type CardBannerProp = {
  value: ReactNode;
  headerIcon: ReactNode;
  label: ReactNode;
  className: string;
  color: CardColorsKey;
};

export function CardBanner({
  value = "-",
  headerIcon = "",
  label = "",
  className = "",
  color = "default",
}: Partial<CardBannerProp>) {
  return (
    <Card
      className={cn(
        "shadow-none",
        "max-w-[350px] max-h-[234px] min-w-[150px]",
        "gap-2",
        "*:whitespace-nowrap *:text-center",
        CardColors[color],
        className
      )}
    >
      <CardContent>
        <ul>
          <li>{headerIcon}</li>
          <li>{label}</li>
          <li className="mt-3 font-medium text-4xl">{value}</li>
        </ul>
      </CardContent>
    </Card>
  );
}
