"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [isPending, setIsPending] = useState(false);
  const router = useRouter();

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    const formData = new FormData(evt.target as HTMLFormElement);
    const email = String(formData.get("email"));

    if (!email) {
      return toast.error("Please enter your email");
    }

    await authClient.forgetPassword.emailOtp({
      email,

      fetchOptions: {
        onRequest: () => {
          setIsPending(true);
        },
        onResponse: () => {
          setIsPending(false);
        },
        onError: (ctx) => {
          console.log(ctx.error);
          toast.error(ctx.error.message);
        },
        onSuccess: () => {
          toast.success("Otp sent to your email");
          router.push(`/auth/verify-otp?email=${email}`);
        },
      },
    });
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase" htmlFor="email">
          Email
        </label>
        <div className="flex items-center border-4 border-black p-3 gap-3 focus-within:bg-gray-50 transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white">
          <Mail className="size-5" />
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your@email.com"
            className="w-full outline-hidden bg-transparent font-medium text-black placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={isPending}
        className="w-full bg-cyan-400 hover:bg-cyan-500 border-4 border-black h-12 text-base font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]"
      >
        {isPending ? "SENDING..." : "SEND RESET LINK"}
      </Button>

      <div className="text-center">
        <Link
          href="/auth/signin"
          className="text-xs font-bold uppercase underline hover:text-cyan-600"
        >
          Back to signin
        </Link>
      </div>
    </form>
  );
}
