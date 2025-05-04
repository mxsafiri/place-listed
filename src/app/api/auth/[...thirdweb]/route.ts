import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { PrivateKeyWallet } from "@thirdweb-dev/auth/evm";
import { NextRequest, NextResponse } from "next/server";

// Create a wallet instance using the private key
const wallet = new PrivateKeyWallet(process.env.THIRDWEB_SECRET_KEY || "");

// Create the auth instance with the domain and wallet
const thirdwebAuth = ThirdwebAuth({
  domain: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  wallet: wallet,
});

// Handle GET and POST requests for auth
export const { GET, POST } = thirdwebAuth;
