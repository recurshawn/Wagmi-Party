"use client";

import { WalletDefault } from "@coinbase/onchainkit/wallet";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto">
      <WalletDefault />
    </div>
  );
}
