"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useSession } from "next-auth/react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "../utils/firebase/config/firebase_auth";
import { signInWithFirebase, signOutFromFirebase } from "../utils/firebase_auth_async";
import LoadingLayout from "./LoadingLayout";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
    const { data: session } = useSession();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            console.log("firebaseUser", firebaseUser)
            setUser(firebaseUser);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fbAsync = async () => {
            if (session?.user?.idToken) {
                await signInWithFirebase(session.user.idToken)
            } else if (!session) {
                await signOutFromFirebase();
            }
        }
        fbAsync()
    }, [session]);

    return (
        <AuthContext.Provider value={{ user, loading, signOutUser: () => signOut(auth) }}>
            {
                loading ? <LoadingLayout /> : children
            }
        </AuthContext.Provider>
    );
}

export function useFirebaseAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useFirebaseAuth must be used within a FirebaseAuthProvider");
    }
    return context;
}
