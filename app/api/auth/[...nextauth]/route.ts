import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const adminEmails = ['myanmarokinawaevents@gmail.com'];

// NextAuth configuration
function nextAuthOptions(req: NextApiRequest): NextAuthOptions {
  return {
    providers: [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          // authorization: {
          //   params: {
          //     prompt: "select_account",
          //     //login_hint: loginHint // Use the login_hint from query parameters
          //   }
          // }
        })
      ],
    callbacks: {
      async jwt({ token, account, user }) {
        // Save user info and access token in the JWT token
        if (account) {
            token.accessToken = account.access_token;
          }
  
          // If the user exists, add the isAdmin flag
          if (user) {
            if (adminEmails.includes(user.email as string)) {
              token.isAdmin = true; // Flag user as admin
            } else {
              token.isAdmin = false; // Otherwise flag as not admin
            }
          }
        return token;
      },
      async session({ session }) {
        // Log session information for debugging
        console.log('Session:', session);
        return session;
      },
      async signIn({ user, account, profile, email, credentials }) {
        console.log('User ' + JSON.stringify(user, null ,2));
        // Ensure the user has a Gmail email
        if (!user.email?.endsWith('@gmail.com')) {
            return false; // Reject non-Gmail users
        }
        // You can add further logic here if needed (e.g., reject non-admin users)
        return true;
      },
    },
    events: {
        // These are for audit log
        async signIn(message) { 
            console.log('Sucessful Sign In : ' + message.user.name);
         },
        async signOut(message) { 
            console.log('Sucessful Sign Out : ');
         },
        async session(message) { 
            console.log('Session Active : ');
        },
      }
    
  }
  }
  

export const GET = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req));
};

export const POST = (req: NextApiRequest, res: NextApiResponse) => {
  return NextAuth(req, res, nextAuthOptions(req));
};
