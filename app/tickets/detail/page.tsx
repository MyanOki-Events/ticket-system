"use client";

//import { useSession } from "next-auth/react";
import { useState, useRef, SetStateAction } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button, Form } from 'react-bootstrap';
import styles from "./login.module.css"; // Import the CSS module
import '../../common/styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

const TicketsPage = () =>  {
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Concert Ticket', description: 'Join us for a night of amazing music!', date: 'March 25, 2025', image: '/ticket_sample.jpg', qrCode: '/qr-code-example.jpg' },
    { id: 2, title: 'Concert Ticket', description: 'Join us for a night of amazing music!', date: 'March 25, 2025', image: '/ticket_sample.jpg', qrCode: '/qr-code-example.jpg' },
    { id: 3, title: 'Concert Ticket', description: 'Join us for a night of amazing music!', date: 'March 25, 2025', image: '/ticket_sample.jpg', qrCode: '/qr-code-example.jpg' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setTickets(tickets.filter(ticket => ticket.id !== id));
    setShowModal(false);
  };

  const handleButtonClick = (id: number) => {
    setSelectedTicketId(id);
    setShowModal(true);
  };

  return (
    <><div ><Header /></div>
    <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
      <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>List of Purchased Tickets</h3>
      <div className="row">
        {tickets.map(ticket => (
          <div key={ticket.id} className="col-12 mb-4">
            <div className="card shadow ticket-card" style={{ position: 'relative', userSelect: 'none' }}>
              <div className="d-flex justify-content-between align-items-center p-2">
                <span className="ticket-title">{ticket.title}</span>
                <button className="btn btn-delete" onClick={() => handleButtonClick(ticket.id)}>
                  Delete <i className="bi bi-trash"></i>
                </button>
              </div>
              <div className="row g-0">
                <div className="col-md-4">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      className="img-fluid rounded-start"
                      onMouseDown={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                    />
                </div>
                <div className="col-md-4">
                  <div className="card-body">
                    <p className="card-text">{ticket.description}</p>
                    <p className="card-text"><small className="text-muted">{ticket.date}</small></p>
                  </div>
                </div>
                <div className="col-md-4">
                    <img
                      src={ticket.qrCode}
                      alt="QR Code"
                      className="img-fluid rounded-start"
                      onMouseDown={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                    />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Delete Confirmation */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-dark">Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="text-dark">
            Are you sure you want to delete this ticket?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => handleDelete(selectedTicketId as number)}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
    <div>
      <Footer />
    </div></>
  );
};

export default TicketsPage;