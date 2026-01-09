"use client";

import type { ChangeEvent } from "react";

type TextInputWithLabelProps = {
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
      <label className="text-sm font-medium text-zinc-700" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="w-full rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400"
        type={type}
        value={value}
        onChange={onChange}
      />
    </div>
  );
}
