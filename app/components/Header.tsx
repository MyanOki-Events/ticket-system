"use client"

import { SetStateAction, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { signOut, useSession } from "next-auth/react";
import '../common/styles/globals.css';
import { usePathname } from 'next/navigation';
import { signOutFromFirebase } from "../utils/firebase_auth_async";
import Link from "next/link";
import { getUserById } from "../services/user_service";
import { User } from "../dao/user";

const Header = ({ }) => {
  const [activeItem, setActiveItem] = useState('booking');
  const { data: session } = useSession();
  const pathname = usePathname();

  const [userGoogleName, setUserGoogleName] = useState("");
  const [userDisplayName, setUserDisplayName] = useState("");

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    if (pathname === '/tickets/booking') {
      setActiveItem('booking');
    } else if (pathname === '/tickets/detail') {
      setActiveItem('detail');
    } else if (pathname === '/settings') {
      setActiveItem('edit');
    } else if (pathname === '/admin/event' || pathname === '/admin/event/add_new' || pathname.includes('/admin/event/edit_old')) {
      setActiveItem('event');
    } else if (pathname === '/admin' || pathname.includes('/admin/member') || pathname.includes('/admin/ticket') || pathname.includes('/admin/qrcode')) {
      setActiveItem('admin');
    } else {
      // No navigation
      setActiveItem('')
    }
  }, [pathname]);

  useEffect(() => {
    if (session?.user.userId) {
      getUserById(session.user.userId)
        .then((data) => {
          setUserGoogleName((data as User).name ?? "")
          setUserDisplayName((data as User).displayName ?? "")
        })
        .catch((error) => console.log(error))
    }
  }, [session])


  const handleItemClick = (section: SetStateAction<string>) => {
    setActiveItem(section);
  };

  const handleLogout = async () => {
    await signOut({ callbackUrl: "/" });
    await signOutFromFirebase()
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
                  {(userDisplayName && userDisplayName !== "") ? userDisplayName : userGoogleName}
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
              <li className={`nav-item ${activeItem === 'edit' ? 'active' : ''} d-md-none d-md-block`}>
                <a className="nav-link" href="/settings" onClick={() => handleItemClick('edit')}>Edit Profile</a>
              </li>
              {/* Show Admin Dashboard link if user is admin */}
              {session && session.user?.role === 99 && (
                <>
                  <li className={`nav-item ${activeItem === 'event' ? 'active' : ''}`}>
                    <a className="nav-link" href="/admin/event" onClick={() => handleItemClick('event')}>Events</a>
                  </li>
                  <li className={`nav-item ${activeItem === 'admin' ? 'active' : ''}`}>
                    <a className="nav-link" href="/admin" onClick={() => handleItemClick('admin')}>Admin Dashboard</a>
                  </li>
                </>
              )}
            </ul>
            <div className="d-flex ms-auto align-items-center">
              {session && (
                <>
                  {/* Show username only on larger screens */}
                  <span className="d-none d-sm-block text-white me-3" style={{ fontSize: '14px' }}>
                    <i className="bi bi-person-circle me-2" style={{ fontSize: '16px' }}></i>
                    {(userDisplayName && userDisplayName !== "") ? userDisplayName : userGoogleName}
                  </span>
                  {/* Ensure Logout button is always at the end */}
                  <div className="d-none d-sm-block btn-group">
                    <i
                      className="bi bi-gear dropdown-toggle text-white fs-5 btn rounded"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    ></i>
                    <ul className="dropdown-menu">
                      <li>
                        {/* Edit Profile Link */}
                        <Link href={`/settings`} className="dropdown-item">Edit Profile</Link>
                      </li>
                      <li className="border-bottom"></li>
                      <li>
                        <span onClick={handleLogout} className="dropdown-item">Logout</span>
                      </li>
                    </ul>
                  </div>
                  <button className="d-md-none d-md-block btn btn-danger" onClick={handleLogout}>
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