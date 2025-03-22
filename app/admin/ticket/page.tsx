"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { getAllUsers } from "@/app/services/user_service";
import { User } from "@/app/dao/user";
import { useAuth } from "@/app/contexts/AuthContext";
import LoadingLayout from "@/app/components/LoadingLayout";
import { getAllTickets, updateTicketPayment } from "@/app/services/ticket_service";
import Ticket from "@/app/dao/ticket";
import { convertDate } from "@/app/utils/date_utils/date_format";
import Link from "next/link";
import { Modal, Button } from 'react-bootstrap';
import Event from '@/app/dao/event';
import { getAllEvent } from '@/app/services/event_services';

class CustomTicket extends Ticket {
    userName: string = ""
    userEmail: string = ""
}

enum FilterKey {
    USERNAME = "user_name_id",
    EMAIL = "email_id",
    TICKETNO = "ticket_no"
}

const AllTicketsPage = () => {
    const { data: session } = useSession();
    const [users, setUsers] = useState<User[]>([]);
    const [tickets, setTickets] = useState<CustomTicket[]>([]);
    const [filterTickets, setFilterTickets] = useState<CustomTicket[]>([]);
    const { loading } = useAuth()

    const [userNameFilter, setUserNameFilter] = useState<string>("");
    const [userEmailFilter, setUserEmailFilter] = useState<string>("");
    const [ticketNoFilter, setTicketNoFilter] = useState<string>("");

    const [startPos, setStartPos] = useState<number>();
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(1);
    const [endPos, setEndPos] = useState<number>();
    const [showLimit, setShowLimit] = useState<number>(5);

    const [ticketDataUpdateSync, setTicketDataUpdateSync] = useState<boolean>(false)
    const [preventDbClick, setPreventDbClick] = useState(false)
    const [showModal, setShowModal] = useState(false);
    const [selectedTicketInfo, setSelectedTicketInfo] = useState<Map<string, string>>();
    const [eventTickets, setEventTickets] = useState<Event[]>([]);

    // get email send flg
    const isSendEmail = process.env.NEXT_PUBLIC_GMAIL_SEND_FLG!;

    useEffect(() => {
        getAllUsers()
            .then((data) => {
                setUsers(data)
            })
            .catch((error) => console.log(error))
    }, [session]);

    // Listen user data changes and update tickets data
    useEffect(() => {
        if (users && users.length > 0) {
            getAllTickets((data) => {
                try {
                    const _userKeys = Object.keys(data)
                    if (_userKeys && _userKeys.length > 0) {
                        for (let i = 0; i < _userKeys.length; i++) {
                            const uId = _userKeys[i]
                            const tks = data[uId].tickets
                            const _ticketKeys = Object.keys(tks)
                            if (_ticketKeys && _ticketKeys.length > 0) {
                                for (let j = 0; j < _ticketKeys.length; j++) {
                                    const tId = _ticketKeys[j]
                                    const user = users.filter((user) => user.userId == uId)
                                    const uName = user && user[0] ? (user[0].displayName || user[0].name) : ''
                                    const uEmail = user && user[0] ? user[0].email : ""
                                    const tObj = new CustomTicket(uId)
                                    tObj.ticketId = tId
                                    tObj.userName = uName
                                    tObj.userEmail = uEmail
                                    tObj.ticketNo = tks[tId].ticketNo
                                    tObj.ticketTmpNo = tks[tId].ticketTmpNo
                                    tObj.isPaid = tks[tId].isPaid
                                    tObj.isUsed = tks[tId].isUsed
                                    tObj.ticketType = tks[tId].ticketType
                                    tObj.created = tks[tId].created
                                    tObj.updated = tks[tId].updated

                                    setTickets((prevObj) => {
                                        if (prevObj && prevObj.filter((obj) => obj.ticketId === tObj.ticketId).length > 0) {
                                            return prevObj.map((obj) => obj.ticketId === tObj.ticketId ? tObj : obj);
                                        }

                                        return [...prevObj, tObj]
                                    })
                                }
                            }
                        }
                    }
                } catch (error) {
                    console.log(error)
                } finally {
                    console.log(tickets)
                }
            })
        }
    }, [users])

    // Listen tickets data changes and update filter data
    useEffect(() => {
        setTicketDataUpdateSync(true)
        setFilterTickets(tickets)
    }, [tickets])

    // Filter input change on update state
    const handleFilterInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        switch (event.target.id) {
            case FilterKey.USERNAME:
                setUserNameFilter(event.target.value);
                break;
            case FilterKey.EMAIL:
                setUserEmailFilter(event.target.value)
                break;
            case FilterKey.TICKETNO:
                setTicketNoFilter(event.target.value)
                break;
        }
    }

    // Listen all filter input changes and update filter data
    useEffect(() => {
        filteringInputAction()
    }, [userNameFilter, userEmailFilter, ticketNoFilter])

    const filteringInputAction = () => {
        setTicketDataUpdateSync(false)
        if (userNameFilter === "" && userEmailFilter === "" && ticketNoFilter === "") {
            // reset
            //setFilterTickets(tickets)
            return;
        }

        setFilterTickets(
            tickets
                .filter((ticket) => {
                    if (userNameFilter !== "") {
                        return ticket.userName.toLowerCase().includes(userNameFilter.toLowerCase())
                    }
                    return true
                })
                .filter((ticket) => {
                    if (userEmailFilter !== "") {
                        return ticket.userEmail.toLowerCase().includes(userEmailFilter.toLowerCase())
                    }
                    return true
                })
                .filter((ticket) => {
                    if (ticketNoFilter !== "") {
                        return String(ticket.ticketTmpNo).toLowerCase().includes(ticketNoFilter.toLowerCase())
                    }
                    return true
                })
        )
    }

    useEffect(() => {
        if (ticketDataUpdateSync) {
            filteringInputAction()
        }

        if (filterTickets && filterTickets.length > 0) {
            setCurrentPage((cur) => Math.min(Math.ceil(filterTickets.length / showLimit), cur))
            setLastPage(Math.ceil(filterTickets.length / showLimit))
            return;
        }

        setCurrentPage(1)
        setLastPage(1)
    }, [filterTickets])

    const handleButtonClick = (
        userId: string, 
        userName: string, 
        userEmail: string,
        ticketType: string,
        ticketId: string,
        ticketTmpNo: number
    ) => {
        let data: Map<string, any> = new Map()
        data.set("userId", userId)
        data.set("userName", userName)
        data.set("userEmail", userEmail)
        data.set("ticketType", ticketType)
        data.set("ticketId", ticketId)
        data.set("ticketTmpNo", ticketTmpNo)
        setSelectedTicketInfo(data);
        setShowModal(true);
      };

    const payAction = async (
        userId: string,
        userName: string,
        userEmail: string,
        ticketType: string,
        ticketId: string,
        ticketTmpNo: string
    ) => {
        console.log("payAction")
        if (preventDbClick) {
            return;
        }
        console.log("Pass")
        setPreventDbClick(true)
        setShowModal(true);
        const finalTicketId = await updateTicketPayment(userId, ticketType, ticketId)
        setShowModal(false);
        
        // Extract ticketTitle from the filtered events
        const eventType = eventTickets.filter((evt) => evt.eventId == ticketType).pop()?.eventTitle;

        if(isSendEmail === 'true') {
            sendEmail(String(userEmail),
            String(userName), String(eventType), String(finalTicketId).padStart(4, "0"), 'T' + ticketTmpNo);
        }
        setPreventDbClick(false)
    }

    useEffect(() => {
        getAllEvent()
            .then((res) => {
            setEventTickets(res)
            })
            .catch((error) => console.log(error))  
    }, [getAllEvent])

    async function sendEmail(
        email: string, 
        customerName: string,
        ticketType: string,
        ticketNo: string,
        ticketTmpNo: string
      ) {
        console.log('Send Email Method')
        const currentDate = new Date();
        const formattedDate = currentDate.toLocaleString('ja-JP', {
            timeZone: 'Asia/Tokyo',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit', 
            minute: '2-digit',
            second: '2-digit', 
            hour12: false, // 24-hour format
        });
        try {
          const res = await fetch('/api/send-email', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              to: email,
              customerName: customerName,
              bookingDate: formattedDate,
              ticketType: ticketType,
              ticketIds: `${ticketTmpNo}(Temp) >>> ${ticketNo}(Final)`,
              emailType: "purchase"
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

    const backPage = () => {
        setCurrentPage((cur) => cur = cur - 1)
    }

    const nextPage = () => {
        setCurrentPage((cur) => cur = cur + 1)
    }

    // Listen current datatable page change and update start and end positions
    useEffect(() => {
        setStartPos((currentPage - 1) * showLimit)
        setEndPos((currentPage * showLimit))
    }, [currentPage])

    return (
        <>
            <Header />

            {
                loading ?
                    <LoadingLayout /> :           
                    <div className="container" style={{ padding: '20px' }}>
                        <h1 className="text-center text-dark" style={{ paddingTop: '60px' }}>All Tickets</h1>
                        {/* Breadcrumb Navigation */}
                        <nav aria-label="breadcrumb">
                            <ol className="breadcrumb">
                                <li className="breadcrumb-item">
                                    <Link href="/admin">Admin Dashboard</Link>
                                </li>
                                <li className="breadcrumb-item active" aria-current="page">
                                    All Tickets
                                </li>
                            </ol>
                        </nav>
                        <section>
                            {/* <h3 className="text-dark">All Users</h3> */}
                            <div className="mb-3 d-flex gap-2">
                                <div className="col">
                                    <input type="text" value={userNameFilter} onChange={handleFilterInputChange} className="col form-control" id={FilterKey.USERNAME} placeholder="Type UserName" />
                                </div>
                                <div className="col">
                                    <input type="text" value={userEmailFilter} onChange={handleFilterInputChange} className="col form-control" id={FilterKey.EMAIL} placeholder="Type Email" />
                                </div>
                                <div className="col">
                                    <input type="text" value={ticketNoFilter} onChange={handleFilterInputChange} className="col form-control" id={FilterKey.TICKETNO} placeholder="Type TicketNo" />
                                </div>
                            </div>
                            <div className="overflow-x-scroll">
                                <table className="table table-sm table-bordered border-dark">
                                    <thead>
                                        <tr>
                                            <th>UserName</th>
                                            <th>Email</th>
                                            <th>TicketNo</th>
                                            <th>Paid</th>
                                            <th>Used</th>
                                            <th>Created</th>
                                            <th>Updated</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filterTickets.slice(startPos, endPos).map((ticket) => (
                                            <tr key={ticket.ticketId}>
                                                <td>{ticket.userName}</td>
                                                <td>{ticket.userEmail}</td>
                                                <td>{ticket.ticketNo ? String(ticket.ticketNo).padStart(4, "0") : 'T'+ticket.ticketTmpNo}</td>
                                                <td>{ticket.isPaid ? "OK" : "NG"}</td>
                                                <td>{ticket.isUsed ? "OK" : "NG"}</td>
                                                <td>{convertDate(ticket.created)}</td>
                                                <td>{convertDate(ticket.updated)}</td>
                                                <td>
                                                    <button onClick={() => handleButtonClick(ticket.userId, ticket.userName, ticket.userEmail, ticket.ticketType, ticket.ticketId,
                                                        ticket.ticketTmpNo)} className="btn btn-success" disabled={ticket.isPaid}>Pay</button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            <div className="d-flex gap-2 justify-content-center align-items-center">
                                <button className="btn btn-secondary" disabled={currentPage == 1} onClick={backPage}>&lt;</button>
                                {`Showing ${Number(startPos) + 1} to ${currentPage == lastPage ? filterTickets.length : endPos} of ${filterTickets.length} entries`}
                                <button className="btn btn-secondary" disabled={currentPage == lastPage} onClick={nextPage}>&gt;</button>
                            </div>
                        </section>
                    </div>
            }

            {/* Modal for Delete Confirmation */}
            <Modal
              show={showModal}
              onHide={() => setShowModal(false)}
              centered
              size="lg"
              backdrop="static"
            >
              <Modal.Header closeButton className="bg-primary text-white">
                <Modal.Title style={{ fontSize: '18px' }}>Confirmation of Purchase</Modal.Title>
              </Modal.Header>
              <Modal.Body className="bg-light py-4 px-5">
                <p className="text-dark mb-2" style={{ fontSize: '14px' }}>
                  Are you sure you want to paid this ticket?<br />
                  Ticket No: T{selectedTicketInfo?.get("ticketTmpNo")}
                </p>
              </Modal.Body>
              <Modal.Footer className="bg-light py-3">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button variant="danger" onClick={() => payAction(selectedTicketInfo?.get("userId") as string, selectedTicketInfo?.get("userName") as string, selectedTicketInfo?.get("userEmail") as string, 
                    selectedTicketInfo?.get("ticketType") as string, selectedTicketInfo?.get("ticketId") as string, selectedTicketInfo?.get("ticketTmpNo") as string)}>
                  Confirm
                </Button>
              </Modal.Footer>
            </Modal>
            <Footer />
        </>
    );
};

export default AllTicketsPage;