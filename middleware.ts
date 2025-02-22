import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
    function middleware(req) {
        const token = req.nextauth.token;

        if (req.nextUrl.pathname.startsWith("/admin") && token?.role !== 99) {
            return NextResponse.redirect(new URL("/error/not-authorized", req.url));
        }

        if (req.nextUrl.pathname.startsWith('/_next') || req.nextUrl.pathname.startsWith('/public')) {
            return NextResponse.next()
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
