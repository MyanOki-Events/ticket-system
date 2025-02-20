import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        // const sessionToken = req.cookies.get("next-auth.session-token");
        // const isAuthenticated = !!sessionToken;

        // const url = req.nextUrl.pathname;
        // console.log("path name", url)

        // if (!isAuthenticated) {
        //     const loginUrl = new URL("/", req.url);
        //     loginUrl.searchParams.set("callbackUrl", url);
        //     return NextResponse.redirect(loginUrl);
        // }
        // else 
        if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== 99) {
            return NextResponse.redirect(new URL("/error/not-authorized", req.url));
        }

        return NextResponse.next();
    },
    {
        pages: {
            signIn: "/",
        },
    }
);

export const config = {
    matcher: [
        "/admin/:path*",
        "/tickets/:path*"
    ],
};
