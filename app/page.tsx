
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
