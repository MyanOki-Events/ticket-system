"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import styles from "./login.module.css"; // Import the CSS module
import Image from "next/image";
//import { cookies } from "next/headers";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate email format
    if (!validateEmail(email)) {
      setError("Please enter a valid gmail address");
      return;
    }
    setError(""); // Clear any previous error
    const url = `/api/auth/signin/google?callbackUrl=${encodeURIComponent("/admin")}
    &login_hint=${encodeURIComponent(email)}`;
    console.log('url : ' + url)
    console.log('Email in Client Side : ' + email)
    //cookies().set('login_hint', email)
    await signIn("google", { callbackUrl: "/admin" , 
      authorization : {
        params : {
          login_hint : email 
        }
      }
      }); 
    // await signIn("google", { 
    //   redirect : false , 
    //   callbackUrl: `/api/auth/signin/google?callbackUrl=${encodeURIComponent("/admin")}
    // &login_hint=${encodeURIComponent(email)}`});    
  };

  // Function to validate email
  const validateEmail = (email: string) => {
    const re = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
    return re.test(email);
  };

  return (
    
    // <div className={styles.container}>
    //   <div className={styles.card}>
    //     <Image src="/oma_logo.png" alt="Logo" width={100} height={100} />
    //     <h1 className={styles.title}>Online Tickets System</h1>
    //     <p className={styles.remark}>Note: You must have a google account</p>
    //     <form onSubmit={handleSubmit} className={styles.form}>
    //       {error && <p className={styles.error}>{error}</p>}
    //       <input
    //         type="email"
    //         value={email}
    //         onChange={(e) => setEmail(e.target.value)}
    //         placeholder="Email"
    //         className={`${styles.input} ${error ? styles.inputError : ""}`}
    //         data-tooltip={error}
    //       />
    //       <button type="submit" className={styles.loginButton}>
    //         Login with Google
    //       </button>
    //     </form>
    //   </div>
    // </div>
<div className="container">
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
                <h1 className={styles.title}>Online Tickets System</h1>
                <p className={styles.remark}>Note: You must have a google account</p>
              </div>
              <form onSubmit={handleSubmit}>
                
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
                  <button type="submit" className="btn btn-primary btn-block mt-3">
                    Login with Google
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
