"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase/client";

/** ログアウトを実行するボタン。 */
export default function LogoutButton() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);

  const logoutAction = async () => {
    if (isPending) {
      return;
    }

    setErrorMessage(null);
    setIsPending(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        setErrorMessage(error.message);
        return;
      }

      router.push("/login");
      router.refresh();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="space-y-3">
      <Button onClick={logoutAction} disabled={isPending}>
        Log out
      </Button>
      {errorMessage && (
        <Alert variant="destructive">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}
