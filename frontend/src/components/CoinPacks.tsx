"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { formatCoinPrice, type CoinPack } from "@/lib/api";

const PACK_ACCENT: Record<string, string> = {
  starter: "from-cyan-500/25 to-blue-500/10 border-cyan-400/25",
  plus: "from-indigo-500/30 to-violet-500/10 border-indigo-400/35",
  pro: "from-amber-500/25 to-orange-500/10 border-amber-400/25",
};

export const COIN_PACKS: CoinPack[] = [
  {
    id: "starter",
    stripePriceId: "",
    coins: 50,
    name: "Starter",
    description: "About 5 resume analyses or job matches.",
    popular: false,
    amountCents: 499,
    currency: "usd",
  },
  {
    id: "plus",
    stripePriceId: "",
    coins: 200,
    name: "Plus",
    description: "About 20 runs — best while you are actively applying.",
    popular: true,
    amountCents: 1400,
    currency: "usd",
  },
  {
    id: "pro",
    stripePriceId: "",
    coins: 500,
    name: "Pro",
    description: "A larger balance for teams or a long search.",
    popular: false,
    amountCents: 2999,
    currency: "usd",
  },
];

export default function CoinPacks({
  ctaHref = "/billing",
}: {
  ctaHref?: string;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {COIN_PACKS.map((pack) => (
        <CoinPackCard key={pack.id} pack={pack} href={ctaHref} />
      ))}
    </div>
  );
}

export function CoinPackCard({
  pack,
  href,
  action,
}: {
  pack: CoinPack;
  href?: string;
  action?: ReactNode;
}) {
  const accent =
    PACK_ACCENT[pack.id] ?? "from-white/10 to-transparent border-white/10";
  const price = formatCoinPrice(pack.amountCents, pack.currency);

  return (
    <div
      className={`relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 flex flex-col ${accent} ${
        pack.popular ? "ring-1 ring-indigo-300/40" : ""
      }`}
    >
      {pack.popular ? (
        <span className="absolute top-4 right-4 chip bg-indigo-500/25 text-indigo-100 border-indigo-300/30">
          Popular
        </span>
      ) : null}
      <p className="text-xs font-semibold uppercase tracking-widest text-white/55">
        {pack.name || pack.id}
      </p>
      {price ? (
        <>
          <p className="mt-4 text-5xl font-semibold tracking-tight">{price}</p>
          <p className="mt-1 text-sm text-white/50">{pack.coins} coins</p>
        </>
      ) : (
        <>
          <p className="mt-4 text-5xl font-semibold tracking-tight">
            {pack.coins}
          </p>
          <p className="mt-1 text-sm text-white/50">coins</p>
        </>
      )}
      <p className="mt-4 flex-1 text-sm text-white/65 leading-relaxed">
        {pack.description || `${pack.coins} coins for analyses and matches.`}
      </p>
      {action ??
        (href ? (
          <Link href={href} className="btn-primary mt-6 justify-center">
            {price ? `Get ${pack.coins} coins · ${price}` : "View coin packs"}
          </Link>
        ) : null)}
    </div>
  );
}
