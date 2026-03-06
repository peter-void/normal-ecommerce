import { SignInOAuth } from "@/features/auth/components/sign-in-oauth";
import { SignInForm } from "@/features/auth/components/signin-form";
import Link from "next/link";

export default function SigninPage() {
  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Panel — Decorative */}
      <div className="hidden lg:flex w-1/2 bg-black flex-col items-start justify-between p-16">
        <Link
          href="/"
          className="font-black text-2xl uppercase tracking-tighter text-white"
        >
          BRUTAL SHOP
        </Link>
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-4">
            ✦ WELCOME BACK
          </p>
          <h2 className="text-5xl font-black text-white uppercase leading-tight">
            Good to
            <br />
            See You
            <br />
            Again.
          </h2>
        </div>
        <p className="text-xs text-gray-600 uppercase tracking-widest">
          © {new Date().getFullYear()} Brutal Shop
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          {/* Mobile logo only */}
          <Link
            href="/"
            className="lg:hidden font-black text-xl uppercase tracking-tighter text-black mb-10 block"
          >
            BRUTAL SHOP
          </Link>

          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
            ✦ LOGIN
          </p>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-8">
            Welcome Back
          </h1>

          <SignInForm />

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-200" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 font-semibold text-gray-400 tracking-widest">
                Or continue with
              </span>
            </div>
          </div>

          <SignInOAuth provider="google" />

          <p className="mt-8 text-center text-sm font-semibold text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/signup"
              className="text-black font-bold underline underline-offset-4 hover:text-gray-600 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
