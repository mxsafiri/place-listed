import { ThirdwebAuthHandler } from "@thirdweb-dev/auth/next";

export const { GET, POST } = ThirdwebAuthHandler({
  domain: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  // Use the secret key from environment for backend signature verification
  secretKey: process.env.THIRDWEB_SECRET_KEY!,
  // Optionally, you can add callbacks for login, logout, etc.
  // onLogin: async (req, payload) => { ... },
  // onUser: async (req, user) => { ... },
});
