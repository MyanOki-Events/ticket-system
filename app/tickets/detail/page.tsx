"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button } from 'react-bootstrap';
import '../../common/styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getTicketsByUserId, deleteTicketByIds} from "@/app/services/ticket_service";
import Ticket from "../../dao/ticket";
import { QRCodeCanvas } from 'qrcode.react';
import MessageAlert from '@/app/components/MessageAlert';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

const PageContent = () => {
  const { data: session } = useSession()
  const userId: string = session?.user.userId ?? ""
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<string>('');
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ?? ""
  const [message, setMessage] = useState<string>(''); // Info or success message
  const [error, setError] = useState<string>(''); // Error message
  const [autoIncrementedTickets, setAutoIncrementedTickets] = useState<{ ticketType: string, tickets: (Ticket & { autoIncrementedId: number })[] }[]>([]);
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get('purchaseStatus');

  // チケットデータが変更されたときにグループ化とID付けを実行
  useEffect(() => {
    const groupedTickets: Record<string, Ticket[]> = tickets.reduce((groups, ticket) => {
      if (!groups[ticket.ticketType]) {
        groups[ticket.ticketType] = [];
      }
      groups[ticket.ticketType].push(ticket);
      return groups;
    }, {} as Record<string, Ticket[]>);

    const updatedTickets = Object.keys(groupedTickets).map(ticketType => ({
      ticketType,
      tickets: groupedTickets[ticketType].map((ticket, index) => ({
        ...ticket,
        autoIncrementedId: index + 1,
      }))
    }));

    setAutoIncrementedTickets(updatedTickets);
  }, [tickets]);

  const handleButtonClick = (id : string) => {
    setSelectedTicketId(id);
    setShowModal(true);
  };

  const handleDelete = (id: string) => {
    console.log('Delete Id ' + id);
    setShowModal(false);
    try {
      deleteTicketByIds(userId , String(id))
      setMessage(`The ticket with ID (${id}) is successfully deleted!`);

      // 削除後、状態を更新
      setAutoIncrementedTickets((prevTickets) => {
        return prevTickets.map(group => ({
          ...group,
          tickets: group.tickets.filter(ticket => ticket.ticketId !== id)
        }));
      });
    } catch (error) {
      setError('Unexpected error is occured.Please try again');
      console.log(error)
    }
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
    if (purchaseStatus) {
      setMessage('Booking of the ticket(s) are successully completed!.We will send email of booking detail to your email.'); // メッセージをstateにセット
    }
  }, [_getTicketsByUserId])

  return (
    <><div ><Header /></div>
      <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>List of Purchased Tickets</h3>
        {/* Info or Error Message */}
        <MessageAlert message={message} type="info" />
        <MessageAlert message={error} type="danger" />
        <div className="row">
          {autoIncrementedTickets.length === 0 ? (
            <div className="col-12 mb-4">
              <div className="alert alert-warning text-center" role="alert">
                <span style={{ fontSize: '1.3rem' }}>There is no tickets available at the moment.</span><br/>
                <span style={{ fontSize: '0.8rem' }}>Please move to 'Booking' page and reserve a ticket.</span>
              </div>
            </div>
          ) : (autoIncrementedTickets.map((group, groupIndex) => (
            <div key={groupIndex} className="col-12 mb-4">
              {group.tickets.map((ticket) => (
                <div key={ticket.ticketId} className="col-12 mb-4">
                  <div className="card shadow-lg rounded-3 ticket-card" style={{ position: 'relative', userSelect: 'none', overflow: 'hidden' }}>
                    <div className="d-flex justify-content-between align-items-center p-2">
                      <span className="beautiful-header text-dark" style={{ fontSize: '20px' }}>
                        {ticket.ticketType} ({ticket.autoIncrementedId}) {/* 自動ID */}
                      </span>
                      {ticket.isPaid ? (
                        <button className="btn btn-delete" disabled>
                          Delete <i className="bi bi-trash"></i>
                        </button>
                      ) : (
                        <button className="btn btn-delete" onClick={() => handleButtonClick(ticket.ticketId)}>
                          Delete <i className="bi bi-trash"></i>
                        </button>
                      )}
                    </div>
                    <hr className="styled-hr" />
                    <div className="row g-0">
                      <div className="col-md-4 d-flex justify-content-center align-items-center">
                        <Image
                          src="/water_festival_ticket_final.png"
                          alt={ticket.ticketType}
                          className="img-fluid rounded-start"
                          onMouseDown={(e) => e.preventDefault()}
                          onTouchStart={(e) => e.preventDefault()}
                          style={{ maxHeight: '250px', objectFit: 'cover' }}
                          height={250}
                          width={1000}
                        />
                      </div>

                      <div className="col-md-5 d-flex">
                        <div className="card-body">
                          <h5 className="card-title text-center" style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' }}>
                            Water Festival
                          </h5>
                          <table className="table table-bordered" style={{ border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                            <tbody>
                              <tr>
                                <td style={{ fontSize: '0.8rem' }}><strong>Date:</strong> 20th October 2025</td>
                                <td style={{ fontSize: '0.8rem' }}><strong>Place:</strong> Thadingyut Event Hall, Yangon</td>
                              </tr>
                              <tr>
                                <td style={{ fontSize: '0.8rem' }}><strong>Time:</strong> 10:00 AM - 4:00 PM</td>
                                <td style={{ fontSize: '0.8rem' }}><strong>Address:</strong> 123 Festival Street, Yangon</td>
                              </tr>
                              <tr>
                                <td colSpan={2} className="text-center" style={{ fontSize: '0.8rem' }}>
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
                          {/* -- Hero Section */}
                          <section className="hero-section">
                            <div className="hero-text">
                              <h3>We can't wait to see you anymore!</h3>
                              <p>Let's enjoy together at the Water Festival</p>
                            </div>
                          </section>
                        </div>
                      </div>

                      {/* QR Code Section */}
                      <div className="col-md-3 d-flex justify-content-center">
                        <div style={{ textAlign: 'center', marginTop: '20px' }}>
                          <p style={{ fontSize: '14px', fontWeight: 'bold', color: '#333' }}>QR For Scan</p>
                          <QRCodeCanvas value={`${baseUrl}/admin/qrcode_ticket/${ticket.userId}/${ticket.ticketId}`} size={150} />
                          <p style={{ fontSize: '10px'}}>[Bussiness Use] ID ({ticket.ticketId})</p>
                        </div>
                        
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            ))
          )}
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
                Are you sure you want to delete this ticket?<br/>
                [Bussiness Use] ID ({selectedTicketId})
              </p>
            </Modal.Body>
            <Modal.Footer className="bg-light py-3">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={() => handleDelete(selectedTicketId)}>
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