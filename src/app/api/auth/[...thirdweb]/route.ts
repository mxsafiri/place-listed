import { ThirdwebAuth } from "@thirdweb-dev/auth/next";
import { NextRequest, NextResponse } from "next/server";

// Create the auth instance with the domain and secret key
const thirdwebAuth = ThirdwebAuth({
  domain: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  secretKey: process.env.THIRDWEB_SECRET_KEY,
});

// Handle GET and POST requests for auth
export const { GET, POST } = thirdwebAuth;
