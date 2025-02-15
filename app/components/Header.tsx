import { signOut } from 'next-auth/react';
import { useEffect } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

const Header = ({ }) => {
    useEffect(() => {
        require("bootstrap/dist/js/bootstrap.bundle.min.js");
    }, []);
  return (
    // <header classNameName="bg-light p-3">
    //   <div classNameName="container d-flex justify-content-between align-items-center">
    //     <h5 classNameName="mb-0">Welcome, Login User</h5>
    //     <button classNameName="btn btn-danger" onClick={() => signOut()}>
    //       Logout
    //     </button>
    //   </div>
    // </header>
    <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
         {/* <img src="/oma_logo.png" width="30" height="30" className="d-inline-block align-top" alt=""/> */}
           Online Tickets System
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item active">
                    <a className="nav-link" href="#">Home <span className="sr-only">(current)</span></a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Features</a>
                </li>
                <li className="nav-item">
                    <a className="nav-link" href="#">Pricing</a>
                </li>
            </ul>
            <span className="navbar-text">
            <button className="btn btn-danger" onClick={() => signOut()}>Logout</button>
            </span> 
          {/* <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <span className="nav-link">Welcome, Login User Name</span>
            </li>
            <li className="nav-item">
              <button className="btn btn-danger" onClick={() => signOut()}>Logout</button>
            </li>
          </ul> */}
        </div>
      </div>
    </nav>
  );
};

export default Header;