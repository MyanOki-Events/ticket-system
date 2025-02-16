"use client";
import { signIn, useSession } from "next-auth/react";
import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SessionGuard({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();  // Get session data and status
    const router = useRouter();

    useEffect(() => {
      // If session is loading, do nothing
      if (status === "loading") return;
  
      // If there's no session (meaning user is not logged in), sign in
      if (!session) {
        //signIn("google");  // Trigger sign-in using Google provider
        router.push('/');
      }
    }, [session, status]);  // Re-run effect when session or status changes
  
    return <>{children}</>;  // Render children if session is valid
  }