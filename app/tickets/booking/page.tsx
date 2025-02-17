"use client";

import { useState,useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../common/styles/globals.css';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

const TicketsPage = () => {
  const [ticketCount, setTicketCount] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();

  const handleReset = () => {
    setTicketCount(0);
  };

  const handlePurchase = () => {
    setShowModal(true);
  };

  const ticketPrice = 2500;
  const totalPrice = ticketCount * ticketPrice;

  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');

  const handleConfirmPurchase = () => {
    alert(`You have purchased ${ticketCount} tickets!`);
    setShowModal(false);
    handleReset();
  };

    useEffect(() => {
      if (!session || session.user?.email !== "myanmarokinawaevents@gmail.com") {
        router.push('/tickets/booking');
      }
    }, [session]);
  

  return (
    <><div ><Header /></div>
    <div className="container" style={{ padding: '20px' , backgroundColor: '#f8f9fa'}}>
      <h3 className="text-center" style={{ paddingTop: '60px', color : '#2a9d8f'}}>List of Available Tickets</h3>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h6 className="card-title">David Lai Concert Admission Ticket</h6>
              <div className="mt-4 mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-event text-primary me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      20th October 2025
                    </p>
                  </div>
                  <div className="d-flex align-items-center mb-3" style={{ lineHeight: '1' }}>
                    <i className="bi bi-clock text-warning me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      10:00 AM - 4:00 PM
                    </p>
                  </div>
                  <div className="d-flex align-items-center" style={{ lineHeight: '1' }}>
                    <i className="bi bi-geo-alt text-success me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px', }}>
                      Thadingyut Event Hall, Yangon
                    </p>
                  </div>
                </div>
              </div>
              <p className="card-text" style={{ fontSize: '12px'}}><strong>Price per ticket: &#165;2500</strong></p>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={ticketCount}
                  readOnly />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(ticketCount + 1)}
                >
                  +
                </button>
              </div>
              <button className="btn btn-outline-danger mt-3 me-2" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary mt-3" onClick={handlePurchase}>
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h6 className="card-title">Water Festival Admission Ticket</h6>
              <div className="mt-4 mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-event text-primary me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      20th October 2025
                    </p>
                  </div>
                  <div className="d-flex align-items-center mb-3" style={{ lineHeight: '1' }}>
                    <i className="bi bi-clock text-warning me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      10:00 AM - 4:00 PM
                    </p>
                  </div>
                  <div className="d-flex align-items-center" style={{ lineHeight: '1' }}>
                    <i className="bi bi-geo-alt text-success me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px', }}>
                      Thadingyut Event Hall, Yangon
                    </p>
                  </div>
                </div>
              </div>
              <p className="card-text" style={{ fontSize: '12px'}}><strong>Price per ticket: &#165;2500</strong></p>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={ticketCount}
                  readOnly />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(ticketCount + 1)}
                >
                  +
                </button>
              </div>
              <button className="btn btn-outline-danger mt-3 me-2" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary mt-3" onClick={handlePurchase}>
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h6 className="card-title">Thadingyut Admission Ticket</h6>
              <div className="mt-4 mb-4">
                <div className="d-flex flex-column align-items-center">
                  <div className="d-flex align-items-center mb-3">
                    <i className="bi bi-calendar-event text-primary me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      20th October 2025
                    </p>
                  </div>
                  <div className="d-flex align-items-center mb-3" style={{ lineHeight: '1' }}>
                    <i className="bi bi-clock text-warning me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                      10:00 AM - 4:00 PM
                    </p>
                  </div>
                  <div className="d-flex align-items-center" style={{ lineHeight: '1' }}>
                    <i className="bi bi-geo-alt text-success me-3" style={{ fontSize: '24px' }}></i>
                    <p className="text-muted mb-0" style={{ fontSize: '14px', }}>
                      Thadingyut Event Hall, Yangon
                    </p>
                  </div>
                </div>
              </div>
              <p className="card-text" style={{ fontSize: '12px'}}><strong>Price per ticket: &#165;2500</strong></p>
              <div className="input-group">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(Math.max(0, ticketCount - 1))}
                >
                  -
                </button>
                <input
                  type="text"
                  className="form-control text-center"
                  value={ticketCount}
                  readOnly />
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={() => setTicketCount(ticketCount + 1)}
                >
                  +
                </button>
              </div>
              <button className="btn btn-outline-danger mt-3 me-2" onClick={handleReset}>
                Reset
              </button>
              <button className="btn btn-primary mt-3" onClick={handlePurchase}>
                Purchase
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Modal for Ticket Purchase Confirmation */}
        <Modal 
          show={showModal} 
          onHide={() => setShowModal(false)} 
          centered 
          size="lg" 
          backdrop="static"
        >
          <Modal.Header closeButton className="bg-primary text-white">
            <Modal.Title style={{ fontSize: '18px' }}>Confirm Your Purchase</Modal.Title>
          </Modal.Header>
          <Modal.Body className="bg-light py-4 px-5">
            <div className="mb-4">
              <h5 className="text-dark mb-2" style={{ fontSize: '16px' }}>
                Are you sure you want to purchase {ticketCount} tickets?
              </h5>
              <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                <strong>Ticket Type:</strong> Water Festival
              </p>
              <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                <strong>Total Price:</strong> &#165;{totalPrice}
              </p>
            </div>
            <Form.Group>
              <Form.Label className="text-dark" style={{ fontSize: '14px' }}>Payment Method</Form.Label>
              <Form.Control 
                as="select" 
                value={paymentMethod} 
                onChange={(e) => setPaymentMethod(e.target.value)} 
                className="shadow-sm"
                style={{ fontSize: '14px' }}
              >
                <option>Bank Transfer</option>
                <option>In Person</option>
              </Form.Control>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer className="bg-light py-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirmPurchase}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      <Footer />
    </div></>
  );
};

export default TicketsPage;