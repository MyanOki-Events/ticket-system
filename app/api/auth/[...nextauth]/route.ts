import { loginProcess } from "@/app/services/login_service";
import { signInWithFirebase } from "@/app/utils/firebase_auth_async";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// NextAuth configuration
function nextAuthOptions(): NextAuthOptions {
  return {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!
      })
    ],
    session: {
      strategy: "jwt",
      maxAge: 60 * 30
    },
    jwt: {
      maxAge: 60 * 30
    },
    callbacks: {
      async jwt({ token, account, user }) {
        if (account?.id_token) {
          token.idToken = account.id_token
        }

        // signIn user data save in token
        if (user) {
          token.userId = user.userId;
          token.role = user.role
        }
        return token;
      },
      async session({ session, user, token }) {
        // token data save in session
        if (session.user) {
          session.user.userId = token.userId
          session.user.role = token.role
          session.user.idToken = token.idToken
        }
        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        // Ensure the user has a Gmail email
        if (!user.email?.endsWith('@gmail.com')) {
          return false; // Reject non-Gmail users
        }

        // Save User Credential
        if (!account?.id_token) {
          return false
        }

        // make firebase account authorization
        await signInWithFirebase(account.id_token)

        // You can add further logic here if needed (e.g., reject non-admin users)
        const loginUser = await loginProcess(user)
        if (!loginUser) {
          return false;
        }

        user.userId = loginUser.userId
        user.role = loginUser.role
        return true;
      }
    },
    events: {
      // These are for audit log
      async signIn(message) {
        console.log('Sucessful Sign In : ', message.user.name);
      },
      async signOut(message) {
        console.log('Sucessful Sign Out : ');
      },
      async session(message) {
        console.log('Session Active : ');
      },
    },
    secret: process.env.NEXTAUTH_SECRET,
  }
}

const handler = NextAuth(nextAuthOptions());
export { handler as GET, handler as POST };
