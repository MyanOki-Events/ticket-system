
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
import { getRedirectResult, signInWithRedirect,  onAuthStateChanged} from 'firebase/auth';
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null); // Store user info
  const router = useRouter();

   // Listen to auth state changes (user logged in or logged out)
   useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        console.log("User is logged in:", currentUser);
        setUser(currentUser); // Store authenticated user
        router.push("/tickets/booking"); // Redirect to booking page on success
      } else {
        console.log("No authenticated user");
        setUser(null); // Reset user state if logged out
      }
    });

    return () => unsubscribe(); // Cleanup listener when component is unmounted
  }, [router]);

  useEffect(() => {
    const checkRedirectResult = async () => {
      try {
        // Wait for the redirect result to resolve
        const result = await getRedirectResult(auth);

        if (result && result.user) {
          console.log("User authenticated successfully:", result.user);
          setUser(result.user); 
          // Redirect to another page after successful login
          router.push("/tickets/booking"); // Replace with your desired route
        } else {
          console.log("No authenticated user found.");
        }
      } catch (error) {
        console.error("Error handling redirect result:", error);
        setError("Google Sign-In failed. Please try again.");
      }
    };

    checkRedirectResult(); // Call the function to check for a redirected user
  }, [router]);

  const handleSignIn = async () => {
    // First, validate email before proceeding with sign-in
    if (!validateEmail(email)) {
      setError("Please enter a valid Gmail address.");
      return; // Stop further execution if email is invalid
    }

    setError(""); // Clear any previous error

    try {
      // Optionally, you can dynamically set the login_hint
      provider.setCustomParameters({
        login_hint: `${email}`, // Can be dynamically set if needed
      });

      // Trigger the Google sign-in flow with redirect
      await signInWithRedirect(auth, provider);
    } catch (error) {
      console.error("Error during sign-in:", error);
      setError("Google Sign-In failed. Please try again.");
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid gmail address");
      return;
    }
    setError(""); // Clear any previous error
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
              {user ? (
                <div className="text-center">
                  <h3>Welcome, {user.displayName}</h3>
                  <button className="btn btn-danger" onClick={handleSignOut}>Sign Out</button>
                </div>
              ) : (
                <form>
                  <div className="form-group">
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
                  </div>
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
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
