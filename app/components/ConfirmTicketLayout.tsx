"use client"

import { useCallback, useEffect, useState } from "react";
import { getTicketsByUserIdAndTicketId, updateTicketByIds } from "../services/ticket_service"
import Ticket from "../dao/ticket";
import { convertDate } from "../utils/date_fromat/date_format";
import thisLayout from "./ConfirmTicketLayout.module.css";

enum TicketState {
    UNDEFINED,
    INVALID,
    VALID
}

const ConfirmTicketLayout = ({ userId, ticketId }: { userId: string, ticketId: string }) => {
    const [ticketState, setTicketState] = useState<TicketState>(TicketState.UNDEFINED);
    const [ticket, setTicket] = useState<Ticket>();
    // read ticket info by (userId and ticketId)
    const accessTicketInfo = useCallback(async () => {
        getTicketsByUserIdAndTicketId(userId, ticketId, (res) => {
            if (res && res.length == 0) {
                setTicketState(TicketState.INVALID)
            } else {
                setTicketState(TicketState.VALID)
                setTicket(res as Ticket)
            }
        })
    }, [])

    useEffect(() => {
        accessTicketInfo()
    }, [accessTicketInfo])

    const updatePaidState = async (flag: boolean) => { 
        updateTicketByIds(userId, ticketId, { "isPaid" : flag })
       }

    return (
        <div>
            {
                ticketState == TicketState.UNDEFINED ? <div className="text-primary">In validating process...</div> :
                    ticketState == TicketState.INVALID ? <div className="text-danger">Invalid Token</div> :
                    <div className="">
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Ticket Id</label>
                            <input type="text" className="form-control" value={ticketId} readOnly/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Purchase Date</label>
                            <input type="text" className="form-control" value={convertDate(ticket?.created)} readOnly/>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Paid Status</label>
                            <div>
                                {ticket?.isPaid ? 
                                    <div className="d-flex gap-2">
                                        <button className={"btn btn-outline-success " + thisLayout.flex_equal} disabled>FINISH</button>
                                        {/* <button onClick={() => updatePaidState(false)} className={"btn btn-danger "  + thisLayout.flex_equal}>Cancel Payment</button> */}
                                    </div> : 
                                    <div className="d-flex gap-2">
                                        <button className={"btn btn-outline-danger " + thisLayout.flex_equal} disabled>UNFINISH</button>
                                        <button onClick={() => updatePaidState(true)} className={"btn btn-success " + thisLayout.flex_equal}>Make Payment</button>
                                    </div>
                                }
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="" className="form-label">Used Status</label>
                            <div>
                                {ticket?.isUsed ? 
                                    <button className={"btn btn-outline-success " + thisLayout.flex_equal} disabled>USING</button> : 
                                    <div className="d-flex gap-2">
                                        <button className={"btn btn-outline-secondary " + thisLayout.flex_equal} disabled>NOT USING</button>
                                        <button onClick={() => updatePaidState(true)} className={"btn btn-success "  + thisLayout.flex_equal}>Use Ticket</button>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
            }
        </div>
    )
}

export default ConfirmTicketLayout