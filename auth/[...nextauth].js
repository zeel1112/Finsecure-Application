import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

// If you need to generate Apple client secret dynamically, uncomment below:
// import jwt from "jsonwebtoken";
// function generateAppleClientSecret() {
//   return jwt.sign({}, process.env.APPLE_PRIVATE_KEY, {
//     algorithm: "ES256",
//     issuer: process.env.APPLE_TEAM_ID,
//     audience: "https://appleid.apple.com",
//     subject: process.env.APPLE_ID,
//     expiresIn: "1h",
//     keyid: process.env.APPLE_KEY_ID,
//   });
// }

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    AppleProvider({
      clientId: process.env.APPLE_ID,
      clientSecret: process.env.APPLE_CLIENT_SECRET, // Or use generateAppleClientSecret()
    }),
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "SMS OTP",
      credentials: {
        phone: { label: "Phone", type: "text" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (creds) => {
        // verify creds via your SMS service...
        return creds.phone ? { id: creds.phone } : null;
      },
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
});