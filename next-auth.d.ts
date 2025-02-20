import NextAuth, { DefaultSession } from "next-auth";

// 🔹 Extend User Type to Include ID and Role
declare module "next-auth" {
  interface Session {
    user: {
      userId: string;  // ✅ Add ID field
      role: number;
    } & DefaultSession["user"];
  }

  interface User {
    userId: string;
    role: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId: string;
    role: number;
  }
}
