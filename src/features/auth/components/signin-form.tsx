"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

export function SignInForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    await authClient.signIn.email({
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fetchOptions: {
        onSuccess: () => {
          router.push("/");
        },
        onError: ({ error }) => {
          toast.error(error.message ?? "Something went wrong");
        },
      },
    });

    setIsSubmitting(false);
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-xs font-bold uppercase">Email</label>
        <div className="flex items-center border border-gray-300 px-3 py-2.5 gap-3 focus-within:border-black transition-colors">
          <Mail className="size-5" />
          <input
            type="email"
            name="email"
            placeholder="your@email.com"
            className="w-full outline-hidden bg-transparent font-medium text-black placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase">Password</label>
        <div className="flex items-center border border-gray-300 px-3 py-2.5 gap-3 focus-within:border-black transition-colors">
          <Lock className="size-5" />
          <input
            type="password"
            name="password"
            placeholder="********"
            className="w-full outline-hidden bg-transparent font-medium text-black placeholder:text-gray-400"
            required
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2"></div>
        <Link
          href="/auth/forgot-password"
          className="text-xs font-bold uppercase hover:text-gray-500 transition-colors"
        >
          Forgot password?
        </Link>
      </div>

      <Button
        className="w-full bg-black text-white hover:bg-gray-800 h-11 text-sm font-bold uppercase tracking-widest rounded-none transition-colors"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Logging in..." : "LOGIN"}
      </Button>
    </form>
  );
}
