// import NextAuth, { NextAuthOptions } from "next-auth";
// import GoogleProvider from "next-auth/providers/google";

// const googleProvider = GoogleProvider({
//   clientId: process.env.GOOGLE_CLIENT_ID!,
//   clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//   authorization: {
//     url: "https://accounts.google.com/o/oauth2/auth",
//     params: {
//       prompt: "select_account",
//     },
//   },
// });

// // googleProvider.authorization = (params) =>  {
// //   // Set login_hint dynamically based on passed parameters
// //   return {
// //     url: "https://accounts.google.com/o/oauth2/auth",
// //     params: {
// //       ...params,
// //       login_hint: params.login_hint,
// //     },
// //   };
// // };

// export const authOptions: NextAuthOptions = {
//   providers: [
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//       authorization: {
//         params: {
//           // Use the login_hint parameter to suggest the email to Google
//           prompt: "select_account",
//           //login_hint: "myanmarokinawaevents@gmail.com"
//           //login_hint : "{login_hint}"
//         }
//       }
//     })
//   ],
//   debug : true,
//   session: {
//     strategy: "jwt",
//   },
//   callbacks: {
//     async jwt({ token, account }) {
//       if (account) {
//         token.accessToken = account.access_token;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//     //   if (token) {
//     //     session.accessToken = token.accessToken || '';
//     //   }
//       return session;
//     },
//     async signIn({ user, account, profile, email, credentials }) {
//       console.log('Account : ' + account)
//       if (account?.provider === "google") {
//         console.log("Login Hint:", account.login_hint);
//       }
//       console.log('Email After Sign In : ' + profile?.email);
//       console.log('User After Sign In : ' + profile?.name);
//       // Example of using the email in the signIn callback
//       if (email) {
//         user.email = email as string;
//       }
//       return true;
//     },
//   }
// }

// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST }

import { NextApiRequest, NextApiResponse } from "next";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

// NextAuth configuration
function nextAuthOptions(req: NextApiRequest): NextAuthOptions {
  //const queryParams = req.query;
  //console.log('email ' + req.query.email)
  //console.log('Full Request ' + JSON.stringify(req.query, null, 2))
  //const loginHint = req.query.login_hint as string || '';

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
    async jwt({ token, account }) {
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token }) {
    //   if (token) {
    //     session.accessToken = token.accessToken || '';
    //   }
      return session;
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log('User ' + JSON.stringify(user, null ,2));
      return true;
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

// function auth(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ): ReturnType<typeof NextAuth> {
//   return NextAuth(req, res, nextAuthOptions(req, res));
// }


// function nextAuthOptions(
//   req: NextApiRequest,
//   res: NextApiResponse,
// ): NextAuthOptions {
//   const loginHint = req.query.login_hint as string || '';
//   return {

//     providers: [
//       GoogleProvider({
//         clientId: process.env.GOOGLE_CLIENT_ID!,
//         clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//         authorization: {
//           params: {
//             // Use the login_hint parameter to suggest the email to Google
//             prompt: "select_account",
//             //login_hint: "myanmarokinawaevents@gmail.com"
//             login_hint : loginHint
//           }
//       }
//       }),
//     ],
//     callbacks: {
//       async signIn({ account}): Promise<string> {
//         try {
//            //  your cookies and custom logic
//            console.log('Hi Hi Hi' + account)
   
//           return '/';
//         } catch (authError) {
//           return Promise.reject(authError);
//         }
//       },
//     },
//     secret: 'secret',
//     pages: {
//       signIn: '/auth/signin/',
//     },
//   };
// }

// export { auth as GET, auth as POST };

// function withSentry(auth: (req: NextApiRequest, res: NextApiResponse) => ReturnType<typeof NextAuth>) {
//   throw new Error("Function not implemented.");
// }


