"use client";

import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

/** テキスト入力コンポーネントのプロパティ。 */
export type TextInputWithLabelProps = {
  id: string;
  label: string;
  value: string;
  type?: "text" | "date" | "email" | "password";
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
};

/** ラベル付きテキスト入力を表示する。 */
export default function TextInputWithLabel({
  id,
  label,
  value,
  type = "text",
  onChange,
}: TextInputWithLabelProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={onChange} />
    </div>
  );
}
