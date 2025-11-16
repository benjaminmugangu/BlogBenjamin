"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SubmitButtonProps {
  text: string;
  className?: string;
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
}

export function SubmitButton({ text, className, variant = "default" }: SubmitButtonProps) {
  const { pending } = useFormStatus();

  if (pending) {
    return (
      <Button disabled className={cn("w-fit", className)} variant={variant} type="submit">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>
    );
  }

  return (
    <Button className={cn("w-fit", className)} variant={variant} type="submit">
      {text}
    </Button>
  );
}

