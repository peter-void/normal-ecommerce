import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel */}
      <div className="hidden lg:flex w-1/2 bg-black flex-col items-start justify-between p-16">
        <Link
          href="/"
          className="font-black text-2xl uppercase tracking-tighter text-white"
        >
          BRUTAL SHOP
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            ✦ SECURITY
          </p>
          <h2 className="text-5xl font-black text-white uppercase leading-tight">
            Reset Your
            <br />
            Password.
          </h2>
        </div>
        <p className="text-xs text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Brutal Shop
        </p>
      </div>

      {/* Right Panel */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="lg:hidden font-black text-xl uppercase tracking-tighter text-black mb-10 block"
          >
            BRUTAL SHOP
          </Link>

          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            ✦ FORGOT PASSWORD
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-3">
            Reset Password
          </h1>
          <p className="text-sm text-gray-500 mb-8">
            Enter your email to receive a password reset link.
          </p>

          <ForgotPasswordForm />

          <p className="mt-8 text-center text-sm font-semibold text-gray-500">
            Remember your password?{" "}
            <Link
              href="/auth/signin"
              className="text-black font-bold underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
