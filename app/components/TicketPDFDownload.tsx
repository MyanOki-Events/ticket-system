import React, { useCallback, useState, useEffect } from 'react';
import { PDFDownloadLink } from '@react-pdf/renderer';
import TicketPDF from './TicketPDF';
import Ticket from '@/app/dao/ticket';
import { getTicketsByUserId } from "@/app/services/ticket_service";
import { getAllEvent } from "@/app/services/event_services";
import { useSession } from "next-auth/react";
import Event from "@/app/dao/event";

interface TicketPDFDownloadProps {
  baseUrl: string;
}

const getCurrentDateTime = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // Add leading zero if single digit
    const day = now.getDate().toString().padStart(2, '0');
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    return `${year}${month}${day}${hours}${minutes}${seconds}`;
  };

const TicketPDFDownload: React.FC<TicketPDFDownloadProps> = ({baseUrl }) => {
    const [isClient, setIsClient] = useState(false);
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [eventTickets, setEventTickets] = useState<Event[]>([]);
    const { data: session } = useSession()
    const userId: string = session?.user.userId ?? ""

    const _getTicketsByUserId = useCallback(async () => {
        await getTicketsByUserId(userId, (res) => {
        if (res) {
            const usersArray = Object.entries(res).map(([key, value]) => ({
                userId: userId,
                ticketId: key,
                ...(value as any),
            }));
            const filteredTickets = usersArray.filter(ticket => ticket.ticketNo !== null && ticket.isPaid === true);
            setTickets(filteredTickets as Ticket[])
        } else {
            setTickets([])
        }
        })
    }, [getTicketsByUserId, baseUrl])

    
    // Check if we're on the client-side
    useEffect(() => {
        setIsClient(true);
        _getTicketsByUserId()
        getAllEvent().then((result) => setEventTickets(result))
    }, []);

    if (!isClient) {
        return null; // Render nothing on the server-side
    }

return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <PDFDownloadLink
        document={<TicketPDF tickets={tickets} events={eventTickets} baseUrl={baseUrl} />}
        fileName={`ticket_${getCurrentDateTime()}.pdf`} // Dynamic filename using each ticket's ID
        >
        <button
            style={{
                padding: '10px 10px ',
                marginBottom: '10px',
                backgroundColor: '#3498db',
                color: '#fff',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px'
                }}
            >
            Download Ticket PDF
        </button>
        </PDFDownloadLink>
    </div>
);
}

export default TicketPDFDownload;
