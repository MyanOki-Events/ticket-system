import React, { useState, useEffect } from 'react';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';
import QRCode from 'qrcode';
import Ticket from '@/app/dao/ticket';
import Event from "@/app/dao/event";

// スタイルの定義
const styles = StyleSheet.create({
  body: {
    paddingTop: 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
    flexDirection: 'column',
    backgroundColor: '#ffffff', // Light blue background for a fresh look
    fontFamily: 'Helvetica', // Default font family
  },
  header: {
    fontSize: 5,
    marginBottom: 6,
    textAlign: 'center',
    color: '#3498db', // Blue color for the header
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  ticketTitle: {
    fontSize: 8,
    textAlign: 'center',
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#2c3e50', // Darker color for ticket title
  },
  eventTitle: {
    fontSize: 8,
    paddingTop: 5,
    fontWeight: 'bold',
    color: '#e74c3c', // Red color for event title
  },
  eventDate: {
    fontSize: 5,
    paddingTop: 5,
    color: '#2c3e50', // Dark color for date
  },
  eventTime: {
    fontSize: 5,
    paddingTop: 5,
    color: '#2c3e50',
  },
  eventPlace: {
    fontSize: 5,
    paddingTop: 5,
    color: '#2c3e50',
  },
  eventAddress: {
    fontSize: 5,
    paddingTop: 5,
    color: '#2c3e50',
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 5,
    bottom: 15,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#95a5a6', // Light gray color for page number
  },
  ticketInfo: {
    flexDirection: 'row',
    marginTop: 10,
    borderTop: '1px solid #3498db', // Blue top border for the ticket info section
    paddingTop: 10,
    alignItems: 'center',
  },
  eventInfo: {
    flex: 3,
    paddingRight: 10,
    backgroundColor: '#ecf0f1', // Light gray background for event details
    borderRadius: 8,
    padding: 8,
    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // Shadow effect to make it pop
  },
  imageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
    marginRight: 8
  },
  businessInfo: {
    paddingTop: 8,
    marginTop: 12,
    borderTop: '2px solid #3498db', // Blue border for business info section
    textAlign: 'center',
  },
  ticketNo: {
    fontSize: 5,
    color: '#2c3e50',
  },
  createDT: {
    fontSize: 5,
    color: '#2c3e50',
  },
  qrCodeImage: {
    height: 60,
    width: 60,
    borderRadius: 8, // Rounded corners for the QR code
    border: '2px solid #3498db', // Blue border around the QR code
  },
});

// PDFコンポーネント
interface TicketPDFProps {
  events: Event[];
  tickets: Ticket[];
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
  return `${year}/${month}/${day}${hours}:${minutes}:${seconds}`;
};

const TicketPDF: React.FC<TicketPDFProps> = ({ tickets, baseUrl, events }) => {
  const [isClient, setIsClient] = useState(false);
  const [qrCodeUrls, setQrCodeUrls] = useState<string[]>([]);

  useEffect(() => {
    setIsClient(true); // Ensure we are on the client-side

    const generateQRCodes = async () => {
      try {
        const qrCodes = [];
        for (const ticket of tickets) {
          const qrValue = `${baseUrl}/admin/qrcode_ticket/${ticket.userId}/${ticket.ticketId}`;
          const qrCode = await QRCode.toDataURL(qrValue); // Await each QR code generation synchronously
          qrCodes.push(qrCode);
        }
        setQrCodeUrls(qrCodes); // Once all QR codes are generated, update the state
      } catch (error) {
        console.error('Error generating QR codes:', error);
      }
    };

    // Only generate QR codes if tickets are available
    if (tickets.length > 0) {
      generateQRCodes();
    }
  }, [tickets, baseUrl]);

  return (
    <Document>
      {tickets.map((ticket, index) => (
        <Page key={ticket.ticketId} style={styles.body} size="A7">
          {/* Header Section */}
          <Text style={styles.header} fixed>
            ~ Ticket with QR Code ~
          </Text>

          {/* Ticket Title */}
          <Text style={styles.ticketTitle}>ADMISSION TICKET</Text>

          {/* Event Image */}
          <Image
            src="/water_festival_ticket_final.png"
            style={{ height: 100, width: '100%' }}
          />

          {/* Ticket Info Section */}
          <View style={styles.ticketInfo}>
            {/* Event Information */}
            <View style={styles.eventInfo}>
              <Text style={styles.eventTitle}>{events.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventTitle}</Text>
              <Text style={styles.eventDate}>{events.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventDate}</Text>
              <Text style={styles.eventTime}>{events.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventTime}</Text>
              <Text style={styles.eventPlace}>{events.filter((evt) => evt.eventId == ticket.ticketType).pop()?.eventPlace}</Text>
              <Text style={styles.eventAddress}>{events.filter((evt) => evt.eventId == ticket.ticketType).pop()?.location}</Text>
            </View>

            {/* QR Code */}
            <View style={styles.imageContainer}>
              {/* Render the QR code for the current ticket */}
              <Image
                src={qrCodeUrls[index] || ''}
                style={styles.qrCodeImage}
              />
            </View>
          </View>

          {/* Business Info Section */}
          <View style={styles.businessInfo}>
            <Text style={styles.ticketNo}>Ticket Number: {String(ticket.ticketNo).padStart(4, "0")}</Text>
            <Text style={styles.createDT}>Created at: {getCurrentDateTime()}</Text>
          </View>

          {/* Page Number */}
          <Text
            style={styles.pageNumber}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
            fixed
          />
        </Page>
      ))}
    </Document>

  );
};

export default TicketPDF;
