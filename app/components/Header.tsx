"use-client"

import { SetStateAction, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { signOut, useSession} from "next-auth/react";
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
        </a>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mr-auto">
                <li className={`nav-item ${activeItem === 'booking' ? 'active' : ''}`}>
                    <a className="nav-link" href="/tickets/booking" onClick={() => handleItemClick('booking')}>Booking<span className="sr-only">(current)</span></a>
                </li>
                <li className={`nav-item ${activeItem === 'detail' ? 'active' : ''}`}>
                    <a className="nav-link" href="/tickets/detail" onClick={() => handleItemClick('detail')}>Detail</a>
                </li>
            </ul>
            <span className="navbar-text ms-auto">
            {session &&
                <>
                  <span className="text-white me-3" style={{ fontSize: '14px' }}>{session.user?.name}</span>
                  <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
                </>
            }
            </span> 
        </div>
      </div>
    </nav>
    </div>
  );
};

export default Header;