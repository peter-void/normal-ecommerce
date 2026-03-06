"use client";

import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { Lock, Mail, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function SignUpForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);

    const res = await authClient.signUp.email({
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      fetchOptions: {
        onSuccess: () => {
          router.push("/auth/signin");
          toast.success("Registration completed. Please verify your emaail");
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
        <label className="text-xs font-bold uppercase">Name</label>
        <div className="flex items-center border border-gray-300 px-3 py-2.5 gap-3 focus-within:border-black transition-colors">
          <User className="size-5" />
          <input
            type="text"
            placeholder="Your name"
            name="name"
            minLength={1}
            className="w-full outline-hidden bg-transparent font-medium text-black placeholder:text-gray-400"
            required
          />
        </div>
      </div>

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
            minLength={6}
            maxLength={20}
            required
          />
        </div>
      </div>

      <Button
        className="w-full bg-black text-white hover:bg-gray-800 h-11 text-sm font-bold uppercase tracking-widest rounded-none transition-colors"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Signing up..." : "SIGN UP"}
      </Button>
    </form>
  );
}
