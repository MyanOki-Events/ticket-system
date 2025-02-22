
"use client";

import { useEffect, useState } from "react";
import styles from "./login.module.css"; // Import the CSS module
import Image from "next/image";
//import { cookies } from "next/headers";
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/js/bootstrap.min.js';
import '../app/common/styles/globals.css';
import { provider } from './utils/firebase/config/firebase_app';
//import { getAuth } from 'firebase/auth';
import { auth } from './utils/firebase/config/firebase_auth';
import { getRedirectResult, signInWithRedirect, signInWithPopup, onAuthStateChanged} from 'firebase/auth';
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null); // Store user info
  const router = useRouter();
  // State to handle modal visibility
  const [showModal, setShowModal] = useState(false);
  const handleSignIn = async () => {
    // First, validate email before proceeding with sign-in
    // if (!validateEmail(email)) {
    //   setError("Please enter a valid Gmail address.");
    //   return; // Stop further execution if email is invalid
    // }

    // setError(""); // Clear any previous error

    // TODO: reconsider
    // await signIn("google", { callbackUrl: "/tickets/booking" , 
    //   // authorization : {
    //   //   params : {
    //   //     login_hint : email 
    //   //   }
    //   // }
    // }); 
    router.push('/tickets/booking');
  };

  // Function to validate email
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(email);
  };

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      setUser(null); // Clear user state on sign out
      console.log("User signed out");
    } catch (error) {
      console.error("Error during sign out:", error);
    }
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
                  {/* <div className="form-group">
                    {error && <label className={styles.error}>{error}</label>}
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      required
                    />
                  </div> */}
                  <div className="d-flex justify-content-center">
                    <button
                      type="button"
                      className="btn btn-primary btn-block mt-3"
                      onClick={handleSignIn} // Trigger sign-in on button click
                    >
                      Sign in with Google
                    </button>
                  </div>
                </form>
                {/* User Policy Link */}
                <div className="mt-4 text-center">
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

export default LoginPage;
