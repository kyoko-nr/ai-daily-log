"use client";

import { Provider } from "jotai";

/** アプリ全体のProviderをまとめるコンポーネント。 */
export default function Providers({ children }: { children: React.ReactNode }) {
  return <Provider>{children}</Provider>;
}
