"use client";

import { CoinPackCard, COIN_PACKS } from "@/components/CoinPacks";
import { formatCoinPrice } from "@/lib/api";
import { useAuth } from "@/lib/auth-context";

/** Coin purchases (Stripe Checkout + webhook ledger) run in the hosted app. */
const HOSTED_BILLING_URL = "https://ai-career-copilot-hazel.vercel.app/billing";

export default function BillingPage() {
  const { user } = useAuth();

  return (
    <section className="max-w-5xl mx-auto px-6 pt-10 pb-20">
      <div className="animate-fade-in-up">
        <span className="chip glass text-white/70">Billing</span>
        <h1 className="mt-4 text-4xl sm:text-5xl font-semibold tracking-tight">
          Buy <span className="text-gradient">coins</span>
        </h1>
        <p className="mt-4 text-white/60 max-w-2xl leading-relaxed">
          Coins are charged only after a successful resume analysis or job
          match. New accounts start with a free balance — buy more when you
          need it.
        </p>
        {user ? (
          <p className="mt-4 text-sm text-indigo-200/85">
            Current balance: <strong>{user.interviewCoins}</strong> coins
          </p>
        ) : null}
      </div>

      <p className="mt-6 rounded-2xl border border-indigo-400/25 bg-indigo-500/10 px-4 py-3 text-sm text-indigo-100">
        Payments are part of the hosted version of AICareerCopilot and are not
        included in this open-source build.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COIN_PACKS.map((pack) => {
          const price = formatCoinPrice(pack.amountCents, pack.currency);
          return (
            <CoinPackCard
              key={pack.id}
              pack={pack}
              action={
                <a
                  href={HOSTED_BILLING_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary mt-6 justify-center"
                >
                  {price ? `Buy on hosted app · ${price}` : "Buy on hosted app"}
                </a>
              }
            />
          );
        })}
      </div>
    </section>
  );
}
