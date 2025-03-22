"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect, useCallback, Suspense } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button } from 'react-bootstrap';
import '../../common/styles/globals.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { getTicketsByUserId, deleteTicketByIds } from "@/app/services/ticket_service";
import Ticket from "../../dao/ticket";
import { QRCodeCanvas } from 'qrcode.react';
import MessageAlert from '@/app/components/MessageAlert';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useAuth } from "@/app/contexts/AuthContext";
import LoadingLayout from "@/app/components/LoadingLayout";
import { getAllEvent } from "@/app/services/event_services";
import Event from "@/app/dao/event";
import TicketPDFDownload from '@/app/components/TicketPDFDownload';
import PageTopAction from '@/app/components/PageTopAction';

const PageContent = () => {
  const { data: session } = useSession()
  const userId: string = session?.user.userId ?? ""
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTicketId, setSelectedTicketId] = useState<Map<string, string>>();
  const baseUrl: string = process.env.NEXT_PUBLIC_BASE_URL ?? ""
  const [message, setMessage] = useState<string>(''); // Info or success message
  const [error, setError] = useState<string>(''); // Error message
  const [autoIncrementedTickets, setAutoIncrementedTickets] = useState<{ ticketType: string, tickets: (Ticket & { autoIncrementedId: number })[] }[]>([]);
  const searchParams = useSearchParams();
  const purchaseStatus = searchParams.get('purchaseStatus');
  const [eventTickets, setEventTickets] = useState<Event[]>([]);

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

  const handleButtonClick = (ticketNo: any, ticketId: any) => {
    let data: Map<string, any> = new Map()
    data.set("ticketNo", ticketNo)
    data.set("ticketId", ticketId)
    setSelectedTicketId(data);
    setShowModal(true);
  };

  const handleDelete = (delTicket: any) => {
    // Disable Delete
    if (!delTicket || delTicket.get("ticketNo") === "") {
      return;
    }
    console.log('Delete Id ' + delTicket.get("ticketNo"));
    setShowModal(false);
    try {
      deleteTicketByIds(userId, String(delTicket.get("ticketId")))
      setMessage(`The ticket with ID (T${delTicket.get("ticketNo")}) is successfully deleted!`);

      // 削除後、状態を更新
      setAutoIncrementedTickets((prevTickets) => {
        return prevTickets.map(group => ({
          ...group,
          tickets: group.tickets.filter(ticket => ticket.ticketId !== delTicket.get("ticketId"))
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
        const ticketsArray = Object.entries(res).map(([key, value]) => {
          const { ticketNo, ...other } = (value as any)
          return ({
            userId: userId,
            ticketNo: ticketNo,
            ticketId: key,
            ...other
          });
        });
        setTickets(ticketsArray as Ticket[])
      } else {
        setTickets([])
      }
    })
  }, [session, getTicketsByUserId, baseUrl])

  useEffect(() => {
    getAllEvent()
      .then((result) => setEventTickets(result))
  },[])

  useEffect(() => {
    _getTicketsByUserId()
    if (purchaseStatus) {
      setMessage('Booking of the ticket(s) are successully completed!We will send email of booking detail to your email.');
      // メッセージ表示ステータスをクリアする
    }
  }, [_getTicketsByUserId, purchaseStatus])

  const { loading } = useAuth()

  return (
    <>
      <Header />

      {
        loading ?
          <LoadingLayout /> :
          <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>List of Purchased Tickets</h3>
            {/* Info or Error Message */}
            <MessageAlert message={message} type="info" />
            <MessageAlert message={error} type="danger" />
            {/* Show TicketPDFDownload only if there is at least one paid ticket */}
            {autoIncrementedTickets.length > 0 && autoIncrementedTickets.some(group => 
              group.tickets.some(ticket => ticket.isPaid)
            ) && (
              <TicketPDFDownload baseUrl={baseUrl} />
            )}
            <div className="row">
              {autoIncrementedTickets.length === 0 ? (
                <div className="col-12 mb-4">
                  <div className="alert alert-warning text-center" role="alert">
                    <span style={{ fontSize: '1.3rem' }}>There is no tickets available at the moment.</span><br />
                    <span style={{ fontSize: '0.8rem' }}>Please move to 'Booking' page and reserve a ticket.</span>
                  </div>
                </div>
              ) : (
                autoIncrementedTickets.map((group, groupIndex) => (
                <div key={groupIndex} className="col-12 mb-4">
                  {group.tickets.map((ticket) => (
                    <div key={ticket.ticketId} className="col-12 mb-4">
                      <div className="card shadow-lg rounded-3 ticket-card" style={{ position: 'relative', userSelect: 'none', overflow: 'hidden' }}>
                        <div className="d-flex justify-content-between align-items-center p-2">
                          <span className="beautiful-header text-dark" style={{ fontSize: '20px' }}>
                            {/* if paid isn't finished yet, temporary number will show */}
                            {eventTickets.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventTitle} ({ticket.autoIncrementedId})
                          </span>
                          {ticket.isPaid ? (
                            <button className="btn btn-delete" disabled>
                              Delete <i className="bi bi-trash"></i>
                            </button>
                          ) : (
                            // if paid isn't finished yet, temporary number will show
                            <button className="btn btn-delete" onClick={() => handleButtonClick(ticket.ticketNo || ticket.ticketTmpNo, ticket.ticketId)}>
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
                              className="img-fluid rounded"
                              onMouseDown={(e) => e.preventDefault()}
                              onTouchStart={(e) => e.preventDefault()}
                              style={{ maxHeight: '250px', objectFit: 'cover' }}
                              height={250}
                              width={1000}
                              priority
                            />
                          </div>

                          <div className="col-md-5 d-flex">
                            <div className="card-body">
                              <h5 className="card-title text-center" style={{ fontWeight: 'bold', color: '#2c3e50', fontSize: '15px' }}>
                                {eventTickets.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventTitle}
                              </h5>
                              <table className="table table-bordered" style={{ border: '2px solid #3498db', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
                                <tbody>
                                  <tr>
                                    <td style={{ fontSize: '0.8rem', width: '50%' }}><strong>Date:</strong> {eventTickets.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventDate}</td>
                                    <td style={{ fontSize: '0.8rem', width: '50%' }}><strong>Place:</strong> {eventTickets.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventPlace}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ fontSize: '0.8rem', width: '50%' }}><strong>Time:</strong> {eventTickets.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventTime}</td>
                                    <td style={{ fontSize: '0.8rem', width: '50%' }}><strong>Address:</strong> {eventTickets.filter((evt) => evt.eventId == ticket.ticketType).pop()?.location}</td>
                                  </tr>
                                  <tr>
                                    <td style={{ fontSize: '0.8rem', width: '50%' }}>
                                      <strong>Paid Status: </strong>
                                      {ticket.isPaid ? (
                                        <span className="badge bg-success text-white" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                        <i className="bi bi-check-circle-fill" style={{ fontSize: '0.8rem' }}></i> Paid
                                      </span>
                                    ) : (
                                      <span className="badge bg-warning text-dark" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                        <i className="bi bi-hourglass-split" style={{ fontSize: '0.8rem' }}></i> Not Yet
                                      </span>
                                      )}
                                    </td>
                                    <td style={{ fontSize: '0.8rem', width: '50%' }}>
                                      <strong>Used Status: </strong>
                                      {ticket.isUsed ? (
                                        <span className="badge bg-success text-white" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                          <i className="bi bi-check-circle-fill" style={{ fontSize: '0.8rem' }}></i> Used
                                        </span>
                                      ) : (
                                        <span className="badge bg-warning text-dark" style={{ fontSize: '0.6rem', fontWeight: 'bold' }}>
                                          <i className="bi bi-hourglass-split" style={{ fontSize: '0.8rem' }}></i> Not Yet
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
                              {/* if paid isn't finished yet, temporary number will show */}
                              <p style={{ fontSize: '10px' }}>Ticket No: {String(ticket.ticketNo || `T${ticket.ticketTmpNo}`).padStart(4, "0")}</p>
                              {/* <p style={{ fontSize: '10px' }}>Ticket No: {ticket.ticketNo ? `${ticket.ticketNo}` : `T${ticket.ticketTmpNo}`}</p> */}
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
                <p className="text-dark mb-2" style={{ fontSize: '14px' }}>
                  Are you sure you want to delete this ticket?<br />
                  Ticket No: T{selectedTicketId?.get("ticketNo")}
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
      }

      {/* Scroll to Top Button */}
      <PageTopAction/>
      <Footer />
    </>
  );
};

export default function TicketsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PageContent />
    </Suspense>
  );
}