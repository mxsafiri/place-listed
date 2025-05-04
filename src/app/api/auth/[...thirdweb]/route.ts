import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { NextRequest, NextResponse } from "next/server";

// Create the auth instance with the domain
const thirdwebAuth = ThirdwebAuth({
  domain: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

// Handle GET and POST requests for auth
export const { GET, POST } = thirdwebAuth;
