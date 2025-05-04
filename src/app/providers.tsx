"use client";
import { ThirdwebProvider } from "@thirdweb-dev/react";
import React from "react";
import { WalletAuthProvider } from "@/contexts/WalletAuthContext";

export function AppProviders({ children }: { children: React.ReactNode }) {
  // Hard-code the client ID temporarily to test
  const clientId = "9a0bc1bb34cadddbf56a755cefc47198";
  
  return (
    <ThirdwebProvider clientId={clientId}>
      <WalletAuthProvider>
        {children}
      </WalletAuthProvider>
    </ThirdwebProvider>
  );
}
