"use client";

import type { ChangeEvent } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

type TextAreaWithLabelProps = {
  id: string;
  label: string;
  value: string;
  placeholder: string;
  minHeightClassName?: string;
  errorMessage?: string | null;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
};

/** ラベル付きテキストエリアを表示する。 */
export default function TextAreaWithLabel({
  id,
  label,
  value,
  placeholder,
  minHeightClassName = "min-h-[140px]",
  errorMessage,
  onChange,
}: TextAreaWithLabelProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Textarea
        id={id}
        className={cn(minHeightClassName)}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-invalid={errorMessage ? true : undefined}
      />
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
