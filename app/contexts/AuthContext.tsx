"use client";
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import { getAuth, User } from "firebase/auth";
import { getFirebaseUser, signInWithFirebase, signOutFromFirebase } from "../utils/firebase_auth_async";
// import LoadingLayout from "../components/LoadingLayout";

// ✅ Define Auth Context Type
type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: () => void;
};

// ✅ Create AuthContext
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const { data: session, status } = useSession(); // NextAuth session
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'authenticated') {
            const authInstance = getAuth();

            // ✅ Sync Firebase Auth with NextAuth session
            if (session?.user) {
                authInstance.currentUser?.getIdToken(true); // Refresh Firebase token
                signInWithFirebase(session.user.idToken)
                    .catch((error) => {
                        signOutFromFirebase()
                        signOut()

                    })
            }

            // ✅ Listen to Firebase Auth Changes
            const unsubscribe = getFirebaseUser((_user) => {
                setUser(_user)
                if (_user) {
                    // setTimeout(() => {
                    setLoading(false);
                    // }, 1500);
                }
            })

            return () => unsubscribe();
        }

        if (status === 'unauthenticated') {
            // setTimeout(() => {
            setLoading(false);
            // }, 1500);
        }
    }, [session]);

    return (
        <AuthContext.Provider value={{ user, loading, login: async () => await signIn("google", { callbackUrl: "/" }) }}>
            {
                // loading ? LoadingLayout() : children
                children
            }
        </AuthContext.Provider>
    );
}

// ✅ Custom Hook to Use Auth Context
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth must be used within an AuthProvider");
    return context;
}
