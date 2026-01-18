import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

import LoginClient from "./components/LoginClient";

/** ログイン/サインアップ/パスワードリセットの画面。 */
export default async function LoginPage() {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/");
  }

  return <LoginClient />;
}
