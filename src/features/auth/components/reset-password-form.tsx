"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { authClient } from "@/lib/auth-client";
import { Lock, Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ResetPasswordForm({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (password !== confirmPassword) {
      return toast.error("Passwords do not match");
    }

    if (password.length < 8) {
      return toast.error("Password must be at least 8 characters");
    }

    await authClient.emailOtp.resetPassword({
      email,
      otp,
      password,
      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Password reset successfully");
          router.push("/auth/signin");
        },
      },
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-4">
        {/* New Password */}
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase" htmlFor="password">
            New Password
          </Label>
          <div className="flex items-center border-4 border-black p-3 gap-3 focus-within:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
            <Lock className="size-5" />
            <input
              type="password"
              id="password"
              name="password"
              placeholder="••••••••"
              className="w-full outline-hidden bg-transparent font-medium text-black placeholder:text-gray-400"
              required
              minLength={8}
            />
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label
            className="text-xs font-bold uppercase"
            htmlFor="confirmPassword"
          >
            Confirm New Password
          </Label>
          <div className="flex items-center border-4 border-black p-3 gap-3 focus-within:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
            <Lock className="size-5" />
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="••••••••"
              className="w-full outline-hidden bg-transparent font-medium text-black placeholder:text-gray-400"
              required
              minLength={8}
            />
          </div>
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-orange-400 hover:bg-orange-500 border-4 border-black h-12 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            RESETTING...
          </>
        ) : (
          "SAVE NEW PASSWORD"
        )}
      </Button>

      <div className="text-center pt-2">
        <Link
          href="/auth/signin"
          className="text-xs font-bold uppercase underline hover:text-orange-600 transition-colors"
        >
          Back to signin
        </Link>
      </div>
    </form>
  );
}
