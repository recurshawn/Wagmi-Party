"use client";

import type { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { base } from "wagmi/chains"; // add baseSepolia for testing

import { HuddleProvider, HuddleClient } from "@huddle01/react";

const huddleClient = new HuddleClient({
  projectId: process.env.NEXT_PUBLIC_PROJECT_ID ?? "",
  options: {
    activeSpeakers: {
      size: 8,
    },
  },
});

export function Providers(props: { children: ReactNode }) {
  return (
    <OnchainKitProvider
      apiKey={process.env.NEXT_PUBLIC_ONCHAINKIT_API_KEY}
      chain={base} // add baseSepolia for testing
    >
      <HuddleProvider client={huddleClient}>{props.children}</HuddleProvider>
    </OnchainKitProvider>
  );
}
