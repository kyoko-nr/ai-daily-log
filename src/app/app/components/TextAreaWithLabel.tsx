"use client";

import type { ChangeEvent } from "react";

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
      <label className="text-sm font-medium text-zinc-700" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className={`${minHeightClassName} w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm text-zinc-900 shadow-sm outline-none transition focus:border-zinc-400`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}
    </div>
  );
}
