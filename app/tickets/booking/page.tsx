"use client";

import { useState, useEffect, useRef } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import { Modal, Button, Form } from 'react-bootstrap';
import '../../common/styles/globals.css';
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';
import { getUserByEmail } from '@/app/services/user_service';
import { User } from '@/app/dao/user';
import { addNewTickets} from "@/app/services/ticket_service";
import MessageAlert from '@/app/components/MessageAlert'; 

const TicketsPage = () => {
  const [showModal, setShowModal] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const [message, setMessage] = useState<string>(''); // Info or success message
  const [error, setError] = useState<string>(''); // Error message

  type Ticket = {
    id: number;
    eventTitle: string;
    eventDate: string;
    eventTime: string;
    location: string;
    price: number;
  };

  // TODO (get data from database)
  const tickets: Ticket[] = [
    {
      id: 1,
      eventTitle: 'David Lai Concert',
      eventDate: '30th March 2025',
      eventTime: '11:00 AM - 16:00 PM',
      location: 'David Lai Concert Hall, Okinawa',
      price: 3000,
    },
    { 
      id: 2,
      eventTitle: 'Water Festival',
      eventDate: '20th May 2025',
      eventTime: '11:00 AM - 16:00 PM',
      location: 'Water Festival Event Hall, Okinawa',
      price: 2500,
    }
  ];

  // State for the modal, to display selected ticket information
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  // Initialize ticket count state with each ticket having a count of 0
  const [ticketCounts, setTicketCounts] = useState<{ [key: number]: number }>(
    tickets.reduce((acc, ticket) => {
      acc[ticket.id] = 0;
      return acc;
    },  {} as { [ticketId: number]: number })
  );

  // Function to update the count for a specific ticket by ticket ID
  const handleTicketCountChange = (ticketId: number, change: number) => {
    setTicketCounts((prevCounts) => ({
      ...prevCounts,
      [ticketId]: Math.max(0, prevCounts[ticketId] + change),
    }));
  };

  const handleReset = (ticketId?: number) => {
    //setTicketCount(0);
    setTicketCounts((prevCounts) => {
      if (ticketId !== undefined) {
        return {
          ...prevCounts,
          [ticketId]: 0, // Reset the selected ticket count only
        };
      } else {
        // Reset all ticket counts
        return tickets.reduce((acc, ticket) => {
          acc[ticket.id] = 0;
          return acc;
        }, {} as { [ticketId: number]: number });
      }
    });
  };

  const handlePurchase = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowModal(true);
  };

  const totalPrice = (ticket: Ticket) => {
    return ticketCounts[ticket.id] * ticket.price;
  };

  const [paymentMethod, setPaymentMethod] = useState('Bank Transfer');
  const [userId, setUserId] = useState('');
  
  const handleConfirmPurchase = async (ticket: Ticket, ticketCount: number,ticketType:string, totalPrice:string)=> {
    try {
      // TODO after craete event Table , replace with following code
      //await addNewTickets(userId, ticket.id, ticketCount); 
      await addNewTickets(userId,ticketCount);
      // send email to ticket purchaser
      // TODO change ticketId value
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
      console.log('Ticket Count' + ticketCount);

      sendEmail(String(session?.user.email),
         String(session?.user.name),String(formattedDate),String(totalPrice),paymentMethod,ticketType,'0001',String(ticketCount));
      router.push(`/tickets/detail?purchaseStatus=success`);
    } catch (error) {
      setError('Unexpected error is occured.Please try again');
      console.error("Error while adding tickets:", error);
    } finally {
      setShowModal(false);
      handleReset();
    }
  };

  async function sendEmail(email:string,customerName:string,
    bookingDate:string,
    amountPaid:string,
    paymentMethod:string,
    ticketType:string,
    ticketId:string,
    ticketCount:string

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
          // ticketId: ticketId,
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
    if(session?.user) {
      setUserId(session?.user.userId)
    }
  })

  return (
    <><div ><Header /></div>
      <div className="container" style={{ padding: '20px', backgroundColor: '#f8f9fa' }}>
        <h3 className="text-center" style={{ paddingTop: '60px', color: '#2a9d8f' }}>List of Available Tickets</h3>
        {/* Info or Error Message */}
        <MessageAlert message={message} type="info" />
        <MessageAlert message={error} type="danger" />
        <div className="row mt-4">
          <div className="col-md-6 offset-md-3">
            {tickets.map((ticket, index) => (
              <div key={index} className="card shadow mb-4">
                <div className="card-body text-center">
                  <h6 className="card-title">{ticket.eventTitle} Admission Ticket</h6>
                  <div className="mt-4 mb-4">
                    <div className="d-flex flex-column align-items-center">
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
                      <div className="d-flex align-items-center" style={{ lineHeight: '1' }}>
                        <i className="bi bi-geo-alt text-success me-3" style={{ fontSize: '24px' }}></i>
                        <p className="text-muted mb-0" style={{ fontSize: '14px' }}>
                          {ticket.location}
                        </p>
                      </div>
                    </div>
                  </div>
                  <p className="card-text" style={{ fontSize: '12px' }}>
                    <strong>Price per ticket: &#165;{ticket.price}</strong>
                  </p>
                  <div className="input-group">
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() =>  handleTicketCountChange(ticket.id, -1)}
                    >
                      -
                    </button>
                    <input
                      type="text"
                      className="form-control text-center"
                      value={ticketCounts[ticket.id]}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={() => handleTicketCountChange(ticket.id, 1)}
                    >
                      +
                    </button>
                  </div>
                  <button className="btn btn-outline-danger mt-3 me-2" onClick={() => handleReset(ticket.id)}>
                    Reset
                  </button>
                  <button className="btn btn-primary mt-3" onClick={() => handlePurchase(ticket)}>
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
                Are you sure you want to purchase {ticketCounts[selectedTicket.id]} tickets?
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
                    handleConfirmPurchase(selectedTicket, ticketCounts[selectedTicket.id],selectedTicket.eventTitle,String(totalPrice(selectedTicket)))
                  }>
              Confirm
            </Button>
          </Modal.Footer>
        </Modal>
        )}
        <Footer />
      </div></>
  );
};

export default TicketsPage;