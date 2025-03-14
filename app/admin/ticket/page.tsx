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
                                    const uName = user && user[0] ? user[0].name : ""
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

    const payAction = async (userId: string, ticketType: string, ticketId: string) => {
        console.log("payAction")
        if (preventDbClick) {
            return;
        }
        console.log("Pass")
        setPreventDbClick(true)
        await updateTicketPayment(userId, ticketType, ticketId)
        setPreventDbClick(false)
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
                                                <td>{ticket.ticketNo ? String(ticket.ticketNo).padStart(4, "0") : ticket.ticketTmpNo}</td>
                                                <td>{ticket.isPaid ? "OK" : "NG"}</td>
                                                <td>{ticket.isUsed ? "OK" : "NG"}</td>
                                                <td>{convertDate(ticket.created)}</td>
                                                <td>{convertDate(ticket.updated)}</td>
                                                <td>
                                                    <button onClick={() => payAction(ticket.userId, ticket.ticketType, ticket.ticketId)} className="btn btn-success" disabled={ticket.isPaid}>Pay</button>
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

            <Footer />
        </>
    );
};

export default AllTicketsPage;