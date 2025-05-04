"use server";

import { createAuth } from "thirdweb/auth";
import { privateKeyToAccount } from "thirdweb/wallets";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

// Create a client for thirdweb
const client = {
  clientId: process.env.THIRDWEB_CLIENT_ID || "9a0bc1bb34cadddbf56a755cefc47198",
};

// Ensure we have a private key
const privateKey = process.env.THIRDWEB_SECRET_KEY || "";
if (!privateKey) {
  throw new Error("Missing THIRDWEB_SECRET_KEY in .env file.");
}

// Create the auth instance
const thirdwebAuth = createAuth({
  domain: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  adminAccount: privateKeyToAccount({ client, privateKey }),
  client,
});

// Handle GET requests (for login payload generation)
export async function GET(request: NextRequest) {
  try {
    // Extract the address from the URL if available
    const { searchParams } = new URL(request.url);
    const address = searchParams.get('address');
    
    // Generate payload with the required login request parameter
    const payload = await thirdwebAuth.generatePayload({
      address: address || "",
      chainId: 1, // Default to Ethereum mainnet (as a number)
      statement: "Sign in to PlaceListed",
      uri: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      version: "1",
      nonce: undefined, // Let the SDK generate a nonce
      expirationTime: undefined, // Use default expiration
      resources: undefined, // No specific resources to request
      timeout: 60 * 60, // 1 hour timeout
    });
    
    return NextResponse.json(payload);
  } catch (error) {
    console.error("Error generating auth payload:", error);
    return NextResponse.json({ error: "Failed to generate auth payload" }, { status: 500 });
  }
}

// Handle POST requests (for login verification)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const verifiedPayload = await thirdwebAuth.verifyPayload(body);
    
    if (verifiedPayload.valid) {
      const jwt = await thirdwebAuth.generateJWT({
        payload: verifiedPayload.payload,
      });
      
      // Set JWT in cookies
      cookies().set("jwt", jwt, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      });
      
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Invalid login payload" }, { status: 401 });
    }
  } catch (error) {
    console.error("Error verifying auth payload:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}
