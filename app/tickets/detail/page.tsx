"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button } from 'react-bootstrap';
import '../../common/styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getTicketsByUserId } from "@/app/services/ticket_service";
import Ticket from "../../dao/ticket";
import { QRCodeCanvas } from 'qrcode.react';
import MessageAlert from '@/app/components/MessageAlert';

const PageContent = () => {
  const { data: session } = useSession()
  const userId: string = session?.user.userId ?? ""
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ?? ""
  const [message, setMessage] = useState<string>(''); // Info or success message
  const [error, setError] = useState<string>(''); // Error message

  const handleDelete = (id: number) => {
    setShowModal(false);
    setMessage('This ticket with ID ${id} is successfully deleted!');
  };

  const handleButtonClick = (id: number) => {
    setSelectedTicketId(id);
    setShowModal(true);
  };

  const _getTicketsByUserId = useCallback(async () => {
    await getTicketsByUserId(userId, (res) => {
      if (res) {
        const usersArray = Object.entries(res).map(([key, value]) => ({
          userId: userId,
          ticketId: key,
          ...(value as any),
        }));
        setTickets(usersArray as Ticket[])
      } else {
        setTickets([])
      }
    })
  }, [session, getTicketsByUserId, baseUrl])

  useEffect(() => {
    _getTicketsByUserId()
  }, [_getTicketsByUserId])

  return (
    <><div ><Header /></div>
      <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>List of Purchased Tickets</h3>
        {/* Info or Error Message */}
        <MessageAlert message={message} type="info" />
        <MessageAlert message={error} type="danger" />
        <div className="row">
          {tickets.map((ticket, index) => (
            <div key={index + 1} className="col-12 mb-4">
              <div className="card shadow-lg rounded-3 ticket-card" style={{ position: 'relative', userSelect: 'none', overflow: 'hidden' }}>
                <div className="d-flex justify-content-between align-items-center p-2">
                  <span className="beautiful-header text-dark" style={{ fontSize: '20px' }}>{ticket.ticketType} ({index + 1})</span>
                  <button className="btn btn-delete" onClick={() => handleButtonClick(index + 1)}>
                    Delete <i className="bi bi-trash"></i>
                  </button>
                </div>
                <hr className="styled-hr" />
                <div className="row g-0">
                  <div className="col-md-4 d-flex justify-content-center align-items-center">
                    <img
                      //src={ticket.image}
                      src="/ticket_sample.jpg"
                      alt={ticket.ticketType}
                      className="img-fluid rounded-start"
                      onMouseDown={(e) => e.preventDefault()}
                      onTouchStart={(e) => e.preventDefault()}
                      style={{ maxHeight: '250px', objectFit: 'cover' }}
                    />
                  </div>

                  <div className="col-md-4 d-flex">
                    <div className="card-body">
                      <h5 className="card-title text-center"
                        style={{
                          fontWeight: 'bold',
                          color: '#2c3e50',
                          fontSize: '15px'
                        }}>
                        Water Festival
                      </h5>
                      <table className="table table-bordered table-hover" style={{ border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                        <tbody>
                          <tr>
                            <td><strong>Date:</strong> 20th October 2025</td>
                            <td><strong>Place:</strong> Thadingyut Event Hall, Yangon</td>
                          </tr>
                          <tr>
                            <td><strong>Time:</strong> 10:00 AM - 4:00 PM</td>
                            <td><strong>Address:</strong> 123 Festival Street, Yangon</td>
                          </tr>
                          <tr>
                            <td colSpan={2} className="text-center">
                              <strong>Status: </strong>
                              {ticket.isPaid ? (
                                <span className="text-success" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                  <i className="bi bi-check-circle-fill" style={{ fontSize: '18px' }}></i> Paid
                                </span>
                              ) : (
                                <span className="text-danger" style={{ fontSize: '16px', fontWeight: 'bold' }}>
                                  <i className="bi bi-x-circle-fill" style={{ fontSize: '18px' }}></i> Not Paid
                                </span>
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="col-md-4 d-flex justify-content-center">
                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                      <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>QR Scan</p>
                      <QRCodeCanvas value={`${baseUrl}/admin/qrcode_ticket/${ticket.userId}/${ticket.ticketId}`} size={150} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Modal for Delete Confirmation */}
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
            <p className="text-dark mb-2" style={{ fontSize: '16px' }}>
              Are you sure you want to delete this ticket?
            </p>
          </Modal.Body>
          <Modal.Footer className="bg-light py-3">
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={() => handleDelete(selectedTicketId as number)}>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
      <div>
        <Footer />
      </div></>
  );
};

export default function TicketsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}