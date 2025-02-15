"use client";

import { useState, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../common/styles/globals.css';

const TicketsPage = () => {
  const [ticketCount, setTicketCount] = useState(0);
  const [showModal, setShowModal] = useState(false);

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

  return (
    <><div ><Header /></div>
    <div className="container" style={{ padding: '20px' , backgroundColor: '#f8f9fa'}}>
      <h3 className="text-center" style={{ paddingTop: '60px', color : '#2a9d8f'}}>List of Available Tickets</h3>
      <div className="row mt-4">
        <div className="col-md-6 offset-md-3">
          <div className="card shadow">
            <div className="card-body text-center">
              <h6 className="card-title">David Lai Concert Admission Ticket</h6>
              <p className="card-text" style={{ fontSize: '12px'}}><strong>Price per ticket: &#165;3000</strong></p>
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
              <p className="card-text" style={{ fontSize: '12px'}}><strong>Price per ticket: &#165;1500</strong></p>
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
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Confirm Purchase</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-dark">
            Are you sure you want to purchase {ticketCount} tickets?
          </p>
          <p className="text-dark">
            <strong>Total Price:</strong> &#165;{totalPrice} 
          </p>
          <Form.Group>
            <Form.Label className="text-dark">Payment Method</Form.Label>
            <Form.Control as="select" value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
              <option>Bank Transfer</option>
              <option>In Person</option>
            </Form.Control>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
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