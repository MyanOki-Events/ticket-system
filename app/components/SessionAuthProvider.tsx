"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import LoadingLayout from "./LoadingLayout";

interface AuthContextType {
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function SessionAuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            setLoading(false)
        } else if (status === 'unauthenticated') {
            setLoading(false)
        }
        else {
            setLoading(true)
        }
    }, [session])

    return (
        <AuthContext.Provider value={{ loading }}>
            {
                loading ? <LoadingLayout /> : children
            }
        </AuthContext.Provider>
    );
}

export function useSessionAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useSessionAuth must be used within a SessionAuthProvider");
    }
    return context;
}
