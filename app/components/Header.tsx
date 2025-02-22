"use-client"

import { SetStateAction, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { signOut, useSession } from "next-auth/react";
import '../common/styles/globals.css';
import { usePathname } from 'next/navigation';

const Header = ({ }) => {
  const [activeItem, setActiveItem] = useState('booking');
  const { data: session } = useSession();
  const pathname = usePathname();

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    if (pathname === '/tickets/booking') {
      setActiveItem('booking');
    } else if (pathname === '/tickets/detail') {
      setActiveItem('detail');
    } else if (pathname === '/admin') {
      setActiveItem('admin');
    }
  }, [pathname]);


  const handleItemClick = (section: SetStateAction<string>) => {
    setActiveItem(section);
  };

  const handleLogout = () => {
    signOut({ callbackUrl: "/" });
  };

  return (
    <div>
      <nav className="navbar fixed-top navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand" href="#">
            Tickets Booking System
            {session &&
              <>
                <span className="d-block d-sm-none" style={{ fontSize: '10px', marginTop: '5px' }}>
                  <i className="bi bi-person-circle me-2" style={{ fontSize: '10px' }}></i>
                  {session.user?.name}
                </span>
              </>
            }
          </a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
              <li className={`nav-item ${activeItem === 'booking' ? 'active' : ''}`}>
                <a className="nav-link" href="/tickets/booking" onClick={() => handleItemClick('booking')}>Booking</a>
              </li>
              <li className={`nav-item ${activeItem === 'detail' ? 'active' : ''}`}>
                <a className="nav-link" href="/tickets/detail" onClick={() => handleItemClick('detail')}>Detail</a>
              </li>
              {/* Show Admin Dashboard link if user is admin */}
              {session && session.user?.role === 99 && (
                <li className={`nav-item ${activeItem === 'admin' ? 'active' : ''}`}>
                  <a className="nav-link" href="/admin" onClick={() => handleItemClick('admin')}>Admin Dashboard</a>
                </li>
              )}
            </ul>
            <div className="d-flex ms-auto align-items-center">
              {session && (
                <>
                  {/* Show username only on larger screens */}
                  <span className="d-none d-sm-block text-white me-3" style={{ fontSize: '14px' }}>
                    <i className="bi bi-person-circle me-2" style={{ fontSize: '16px' }}></i>
                    {session.user?.name}
                  </span>
                  {/* Ensure Logout button is always at the end */}
                  <button className="btn btn-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Header;