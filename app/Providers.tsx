'use client'

import { SessionProvider } from "next-auth/react"
import { ReactNode } from "react"
import { AuthProvider } from "./contexts/AuthContext"

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider refetchInterval={4 * 60}>
      <AuthProvider>
        {children}
      </AuthProvider>
    </SessionProvider>
  )
}