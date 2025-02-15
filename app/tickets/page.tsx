"use client";

//import { useSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../components/Header';
import Footer from '../components/Footer';

const TicketsPage = () => {
//   const { data: session } = useSession();

//   if (!session) {
//     return <p>You need to be logged in to view this page.</p>;
//   }

  return (
    <div>
      <Header/>
      <div className="container">
      <h1 className="text-center">Ticket Booking</h1>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h5 className="card-title">Water Festival Admission Ticket</h5>
              <p className="card-text">Tickets Price: ￥2500</p>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  //onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  //value={ticketCount}
                  value="3"
                  readOnly
                />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  //onClick={() => setTicketCount(ticketCount + 1)}
                >
                  +
                </button>
              </div>
              <button className="btn btn-danger mt-3 me-2">
                Reset
              </button>
              <button className="btn btn-success mt-3">
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
        <div className="row">
          <div className="col-12 mb-4">
            <div className="card shadow">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="/ticket_sample.jpg" alt="Concert Ticket" className="img-fluid rounded-start"/>
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <h5 className="card-title">Concert Ticket</h5>
                    <p className="card-text">Join us for a night of amazing music!</p>
                    <p className="card-text"><small className="text-muted">March 25, 2025</small></p>
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <img src="/qr-code-example.jpg" alt="QR Code" className="img-fluid rounded-start" 
                  style={{ maxWidth: '300px', maxHeight : 'auto' }}/>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card shadow">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="/ticket_sample.jpg" alt="Concert Ticket" className="img-fluid rounded-start"/>
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <h5 className="card-title">Concert Ticket</h5>
                    <p className="card-text">Join us for a night of amazing music!</p>
                    <p className="card-text"><small className="text-muted">March 25, 2025</small></p>
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <img src="/qr-code-example.jpg" alt="QR Code" className="img-fluid rounded-start" 
                  style={{ maxWidth: '300px', maxHeight : 'auto' }}/>
                </div> */}
              </div>
            </div>
          </div>
          <div className="col-12 mb-4">
            <div className="card shadow">
              <div className="row g-0">
                <div className="col-md-4">
                  <img src="/ticket_sample.jpg" alt="Concert Ticket" className="img-fluid rounded-start"/>
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <h5 className="card-title">Concert Ticket</h5>
                    <p className="card-text">Join us for a night of amazing music!</p>
                    <p className="card-text"><small className="text-muted">March 25, 2025</small></p>
                  </div>
                </div>
                {/* <div className="col-md-4">
                  <img src="/qr-code-example.jpg" alt="QR Code" className="img-fluid rounded-start" 
                  style={{ maxWidth: '300px', maxHeight : 'auto' }}/>
                </div> */}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
  </div>
  );
};

export default TicketsPage;
