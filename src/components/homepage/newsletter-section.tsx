"use client";

import { useState } from "react";
import { ArrowRightIcon, CheckIcon } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section className="bg-black py-20 px-4 md:px-7 relative overflow-hidden">
      {/* Background horizontal lines */}
      <div
        className="absolute inset-0 opacity-5 pointer-events-none"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, white, white 1px, transparent 1px, transparent 60px)",
        }}
      />

      {/* Large background text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
        <span className="text-[clamp(80px,15vw,200px)] font-black uppercase text-white/3 whitespace-nowrap tracking-tight">
          BRUTAL SHOP
        </span>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-gray-500 mb-4">
            ✦ STAY IN THE LOOP
          </p>
          <h2
            className="font-black uppercase tracking-tight leading-tight text-white mb-3"
            style={{ fontSize: "clamp(28px, 4vw, 56px)" }}
          >
            DROP ALERTS.
            <br />
            <span className="text-gray-600">FIRST ACCESS.</span>
          </h2>
          <p className="text-gray-500 text-sm mb-10 leading-relaxed">
            Be the first to know about new drops, restocks, and exclusive
            offers. No spam — just the good stuff.
          </p>

          {submitted ? (
            <div className="flex items-center justify-center gap-3 py-4">
              <div className="w-8 h-8 bg-white flex items-center justify-center">
                <CheckIcon className="w-4 h-4 text-black" />
              </div>
              <p className="text-white font-black uppercase tracking-widest text-sm">
                You&apos;re on the list!
              </p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="flex flex-col sm:flex-row items-stretch gap-0 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 bg-white/10 border border-white/20 text-white text-sm font-bold px-4 placeholder:text-gray-600 outline-none focus:border-white transition-colors"
              />
              <button
                type="submit"
                className="h-12 px-6 bg-white text-black text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors shrink-0"
              >
                Subscribe
                <ArrowRightIcon className="w-3.5 h-3.5" />
              </button>
            </form>
          )}

          <p className="text-gray-700 text-[10px] uppercase tracking-widest mt-6">
            Join 12,000+ subscribers. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  );
}
