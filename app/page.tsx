
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect } from "react";

const LoginForm = () => {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams();
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  // If already authenticated redirect booking
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === 99) {
        router.replace("/admin");
      }
      if (session.user.role === 0) {
        router.replace("/tickets/detail");
      }
    }
  }, [status, router]);

  // Login Handle
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mt-5 shadow-lg">
            <div className="card-body">
              <div className="text-center">
                <img
                  src="/oma_logo.png"
                  alt="Logo"
                  className="img-fluid"
                  style={{ width: '150px', height: '150px' }}
                />
                <h1 className={styles.title}>Tickets Booking System</h1>
                <p className={styles.remark}>Note: You must have a Google account</p>
              </div>
              <form>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-3"
                    onClick={handleSignIn}>
                    Sign in with Google
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// export default LoginPage;

export default function LoginPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}> {/* ✅ Suspense to prevent hydration mismatch */}
      <LoginForm />
    </Suspense>
  );
}