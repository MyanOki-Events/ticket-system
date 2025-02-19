"use client"

import { useCallback, useEffect, useState } from "react";
import { deleteTicketByIds, getTicketsByUserId, updateTicketByIds } from "../services/ticket_service";
import Ticket from "../dao/ticket";
import { convertDate } from "../utils/date_fromat/date_format";

const TicketLayout = ({ userId }: { userId: string }) => {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const _getTicketsByUserId = useCallback(async () => {
    await getTicketsByUserId(userId, (res) => {
      if (res) {
        const usersArray = Object.entries(res).map(([key, value]) => ({
          ticketId: key,
          ...(value as any),
        }));
        setTickets(usersArray as Ticket[])
      } else {
        setTickets([])
      }
    })
  }, [])

  useEffect(() => {
    _getTicketsByUserId()
  }, [_getTicketsByUserId])

  const deleteTicketById = async (ticketId: string) => {
    await deleteTicketByIds(userId, ticketId)
  }

  const updatePaidState = async (ticketId: string, flag: boolean) => { 
    updateTicketByIds(userId, ticketId, { "isPaid" : flag })
   }

  return (
    <div>
      <div className="overflow-x-scroll">
        <table className="table table-sm table-bordered border-dark">
          <thead>
            <tr>
              <th>Ticket Id</th>
              <th>Paid</th>
              <th>Used</th>
              <th>Created</th>
              <th>Updated</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {
              tickets.map((ticket) => (
                <tr key={ticket.ticketId}>
                  <td>{ticket.ticketId}</td>
                  <td>
                    {ticket.isPaid ?
                      <button onClick={() => updatePaidState(ticket.ticketId, false)} className="btn btn-success">YES</button> :
                      <button onClick={() => updatePaidState(ticket.ticketId, true)} className="btn btn-danger">NOT</button>}
                  </td>
                  <td>{ticket.isUsed ? "YES" : "NO"}</td>
                  <td>{convertDate(ticket.created ?? 0)}</td>
                  <td>{convertDate(ticket.updated ?? 0)}</td>
                  <td>
                    <span onClick={async () => deleteTicketById(ticket.ticketId)}>
                      <i className="bi bi-trash3"></i>
                    </span>
                  </td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TicketLayout;