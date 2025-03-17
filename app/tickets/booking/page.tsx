"use client";

import { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../common/styles/globals.css';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { addNewTickets, getCountOfPaidTickets} from "@/app/services/ticket_service";
import MessageAlert from '@/app/components/MessageAlert';
import Event from '@/app/dao/event';
import { getAllEvent } from '@/app/services/event_services';
import { useAuth } from '@/app/contexts/AuthContext';
import LoadingLayout from '@/app/components/LoadingLayout';

const TicketsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<string>(''); // Info or success message
  const [error, setError] = useState<string>(''); // Error message
  const [eventTickets, setEventTickets] = useState<Event[]>([]);
  const { loading } = useAuth()

  // State for the modal, to display selected ticket information
  const [selectedTicket, setSelectedTicket] = useState<Event | null>(null);

  // Initialize ticket count state with each ticket having a count of 0
  const [ticketCounts, setTicketCounts] = useState<{ [key: string]: number }>({});

  const [paidTickets, setPaidTickets] = useState<{ [key: string]: number }>({}); 

  // Function to update the count for a specific ticket by ticket ID, 
  // the maximum tickets must be 5
  const handleTicketCountChange = (ticketId: string, change: number) => {
    setTicketCounts((prevCounts) => ({
      ...prevCounts,
      [ticketId]: change > 0 ? Math.min(5, (prevCounts[ticketId] ?? 0) + change) : Math.max(0, (prevCounts[ticketId] ?? 0) + change),
    }));
  };

  // Reset Ticket Count
  const handleReset = (ticketId?: string) => {
    setTicketCounts((prevCounts) => {
      if (ticketId !== undefined) {
        return {
          ...prevCounts,
          [ticketId]: 0, // Reset the selected ticket count only
        };
      } else {
        // Reset all ticket counts
        return eventTickets.reduce((acc, ticket) => {
          acc[ticket.eventId] = 0;
          return acc;
        }, {} as { [ticketId: string]: number });
      }
    });
  };

  const handlePurchase = (ticket: Event) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const totalPrice = (ticket: Event) => {
    return ticketCounts[ticket.eventId] * ticket.price;
  };

  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [userId, setUserId] = useState('');
  const handleConfirmPurchase = async (ticket: Event, ticketCount: number, ticketType: string, totalPrice: string) => {
    try {
      // add tickets to database, and get the ticketIds
      const ticketIds: number[] = await addNewTickets(userId, ticket.eventId, ticketCount);

      // prepare for mail send
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleString('ja-JP', {
        timeZone: 'Asia/Tokyo',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour12: false, // 24-hour format
      });
      console.log('Current Date' + formattedDate);
      console.log('Total Price' + totalPrice);
      console.log('Payment Method' + paymentMethod);
      console.log('Ticket Type' + ticketType);
      console.log('Ticket ticketNumbers' + ticketIds.join(","));
      console.log('Ticket Count' + ticketCount);

      sendEmail(String(session?.user.email),
        String(session?.user.name), String(formattedDate), String(totalPrice), paymentMethod, ticketType, /* ticket.eventCode */ ticketIds.join(","), String(ticketCount));
      router.push(`/tickets/detail?purchaseStatus=success`);
    } catch (error) {
      setError('Unexpected error is occured.Please try again');
      console.error("Error while adding tickets:", error);
    } finally {
      setShowModal(false);
      handleReset();
    }
  };

  async function sendEmail(email: string, customerName: string,
    bookingDate: string,
    amountPaid: string,
    paymentMethod: string,
    ticketType: string,
    ticketIds: string,
    ticketCount: string

  ) {
    console.log('Send Email Method')
    try {
      const res = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: email,
          customerName: customerName,
          bookingDate: bookingDate,
          amountPaid: amountPaid,
          paymentMethod: paymentMethod,
          ticketType: ticketType,
          ticketIds: ticketIds,
          ticketCount: ticketCount
        }),
      });

      // Check if the response is OK before trying to parse it
      if (res.ok) {
        const data = await res.json();  // Attempt to parse JSON only if response is OK
        console.log('Email sent successfully:', data);
      } else {
        // Handle non-OK responses (e.g., 400 or 500)
        console.error('Error sending email: ', res.statusText);
      }
    } catch (error) {
      // Log any errors that occur during the fetch or JSON parsing
      console.error('Error in sending email request:', error);
    }
  }

  useEffect(() => {
    if (session?.user) {
      setUserId(session?.user.userId)
    }

    getAllEvent()
      .then((res) => {
        setEventTickets(res)

        // set init value for event ticket
        const count = Object.keys(ticketCounts)
        if (count && count.length === 0) {
          let data: { [key: string]: number } = {}
          eventTickets.map((eve) => {
            data[eve.eventId] = 0
          })
          setTicketCounts(data)
        }
      })
      .catch((error) => console.log(error))

      // Iterate through each event ticket and get the ticket count
      eventTickets.forEach(async (ticket) => {
        await getCountOfPaidTickets(ticket.eventId, (count) => {
          // Update the state for the specific ticket's eventId
          setPaidTickets((prevPaidTickets) => ({
            ...prevPaidTickets, // Keep the previous counts intact
            [ticket.eventId]: count, // Update the count for the current ticket
          }));

          console.log('Count of tickets for eventId ' + ticket.eventId + ': ' + count);
        });
      });
  
  }, [session, getAllEvent])

  return (
    <>
      <Header />

      {
        loading ?
          <LoadingLayout /> :
          <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
            <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>List of Available Tickets</h3>
            {/* Info or Error Message */}
            <MessageAlert message={message} type="info" />
            <MessageAlert message={error} type="danger" />
            <div className="row mt-4">
            <div className="col-md-6 offset-md-3">
                {eventTickets.map((ticket, index) => (
                  <div key={index} className="card shadow mb-4">
                    <div className="card-body text-center">
                      <h6 className="card-title d-flex justify-content-between align-items-center">
                        <span>{ticket.eventTitle} Admission Ticket</span>
                        <span className="badge bg-success tickets-sold-badge">
                          Tickets Sold: {paidTickets[ticket.eventId] || 0}
                        </span>
                      </h6>
                      <div className="mt-4 mb-4">
                        <div className="d-flex flex-column">
                          <div className="d-flex align-items-center mb-3">
                            <i className="bi bi-calendar-event text-primary me-3" style={{ fontSize: '24px' }}></i>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                              {ticket.eventDate}
                            </p>
                          </div>
                          <div className="d-flex align-items-center mb-3" style={{ lineHeight: '1' }}>
                            <i className="bi bi-clock text-warning me-3" style={{ fontSize: '24px' }}></i>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                              {ticket.eventTime}
                            </p>
                          </div>
                          <div className="d-flex align-items-center mb-3" style={{ lineHeight: '1' }}>
                            <i className="bi bi-house text-warning me-3" style={{ fontSize: '24px' }}></i>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                              {ticket.eventPlace}
                            </p>
                          </div>
                          <div className="d-flex align-items-center mb-3" style={{ lineHeight: '1' }}>
                            <i className="bi bi-geo-alt text-success me-3" style={{ fontSize: '24px' }}></i>
                            <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                              {ticket.location}
                            </p>
                          </div>
                          <p className="card-text" style={{ fontSize: '20px' }}>
                            <strong>Price per ticket: &#165;{ticket.price}</strong>
                          </p>
                        </div>
                      </div>
                      <div className="input-group">
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleTicketCountChange(ticket.eventId, -1)}
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={ticketCounts[ticket.eventId] ?? 0}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          type="button"
                          onClick={() => handleTicketCountChange(ticket.eventId, 1)}
                        >
                          +
                        </button>
                      </div>
                      <button className="btn btn-outline-danger mt-3 me-2" onClick={() => handleReset(ticket.eventId)}>
                        Reset
                      </button>
                      <button
                        className="btn btn-primary mt-3"
                        onClick={() => handlePurchase(ticket)}
                        disabled={ticketCounts[ticket.eventId] && ticketCounts[ticket.eventId] > 0 ? false : true}
                      >
                        Reserve
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Modal for Ticket Purchase Confirmation */}
            {selectedTicket && (
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
                      Are you sure you want to purchase {ticketCounts[selectedTicket.eventId]} tickets?
                    </h5>
                    <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                      <strong>Ticket Type:</strong> {selectedTicket.eventTitle}
                    </p>
                    <p className="text-muted mb-1" style={{ fontSize: '14px' }}>
                      <strong>Total Price:</strong> &#165;{totalPrice(selectedTicket)}
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
                  <Button variant="primary" onClick={() =>
                    handleConfirmPurchase(selectedTicket, ticketCounts[selectedTicket.eventId], selectedTicket.eventTitle, String(totalPrice(selectedTicket)))
                  }>
                    Confirm
                  </Button>
                </Modal.Footer>
              </Modal>
            )}
          </div>
      }

      <Footer />
    </>
  );
};

export default TicketsPage;