
"use client";

import { useRouter, useSearchParams } from "next/navigation";
import styles from "./login.module.css";
import { signIn, useSession } from "next-auth/react";
import { Suspense, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/common/styles/globals.css';
import Image from 'next/image';

const LoginForm = () => {
  const { data: session, status } = useSession()
  const searchParams = useSearchParams();
  const router = useRouter()
  const callbackUrl = searchParams.get("callbackUrl");
  // State to handle modal visibility
  const [showModal, setShowModal] = useState(false);

  // If already authenticated redirect booking
  useEffect(() => {
    if (status === "authenticated") {
      if (session.user.role === 99) {
        router.replace(callbackUrl ?? "/admin");
      }
      if (session.user.role === 0) {
        router.replace("/tickets/detail");
      }
    }
  }, [status, router]);

  // Login Handle
  const handleSignIn = async () => {
    await signIn("google", { callbackUrl: "/" });
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleShowModal = () => {
    setShowModal(true);
  };

  return (
    <div className="container" style={{ minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <div className="card mt-5 shadow-lg">
            <div className="card-body">
              <div className="text-center">
                <Image
                  src="/oma_logo.png"
                  alt="Logo"
                  className="img-fluid"
                  style={{ width: '150px', height: '150px' }}
                  height={150}
                  width={150}
                />
                <h1 className={styles.title}>Tickets Booking System</h1>
                <p className={styles.remark}>Note: You must have a valid gmail</p>
              </div>
              <form>
                <div className="d-flex justify-content-center">
                  <button
                    type="button"
                    className="btn btn-primary btn-block mt-3"
                    onClick={handleSignIn}>
                    Sign in with Gmail
                  </button>
                </div>
              </form>
              {/* User Policy Link */}
              <div className="mt-4 text-center" style={{ fontSize: '1rem'}}>
                <p>
                  By signing in, you agree to our{" "}
                  <button
                    className="btn btn-link p-0"
                    onClick={handleShowModal}
                    style={{ textDecoration: "none", color: "#007bff" }}
                  >
                    User Policy
                  </button>
                  .
                </p>
              </div>
            </div>
          </div>

          {/* Modal for User Policy */}
          <div
            className={`modal fade ${showModal ? "show" : ""}`}
            tabIndex={-1}
            aria-labelledby="userPolicyModalLabel"
            aria-hidden={!showModal}
            style={{ display: showModal ? "block" : "none" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title text-dark" id="userPolicyModalLabel">
                    User Policy
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                    aria-label="Close"
                  ></button>
                </div>
                <div className="modal-body">
                  <h5 className=" text-dark">Terms of Service</h5>
                  <p className=" text-dark">
                    1. Data Collection
                    <br />
                    - We collect basic information from your Gmail account such as your name and email address. This is used only to create your user profile and allow you to sign in to our service.
                  </p>
                  <p className=" text-dark">
                    2. How We Use Your Data
                    <br />
                    - We use the information collected from your Gmail account to provide you with a personalized experience on our platform, such as displaying your name on the interface.
                    <br />
                    - We do not share or sell your data to third parties for marketing purposes.
                  </p>
                  <p className=" text-dark">
                    3. How We Protect Your Data
                    <br />
                    - We use industry-standard encryption and security practices to protect your personal information from unauthorized access.
                    Your information is stored securely and only accessible by authorized personnel.
                  </p>
                  <p className=" text-dark">
                    4. Third-Party Services
                    <br />
                    - We use third-party services like Google for authentication, and by using Gmail to sign in, you are also bound by Google’s privacy policy.
                    We are not responsible for the privacy practices of third-party services. Please review Google’s privacy policy for more information.
                  </p>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                </div>
              </div>
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