"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { useState } from "react";
import { toast } from "sonner";

interface SignInOAuthProps {
  provider: "google";
  className?: string;
}

export function SignInOAuth({ provider, className }: SignInOAuthProps) {
  const [isPending, setIsPending] = useState(false);

  const handleClick = async () => {
    await authClient.signIn.social({
      provider,
      errorCallbackURL: "/auth/login/error",
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      },
    });
  };

  return (
    <Button
      className={`w-full bg-white text-black border border-gray-300 h-11 font-bold text-sm uppercase tracking-widest hover:bg-gray-50 hover:border-black transition-colors rounded-none ${className}`}
      onClick={handleClick}
      disabled={isPending}
    >
      {provider.toUpperCase()}
    </Button>
  );
}
