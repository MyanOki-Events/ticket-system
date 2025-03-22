import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { to, bookingDate, amountPaid, paymentMethod, ticketType, ticketIds, ticketCount, customerName } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL!, // sender email 
        pass: process.env.GMAIL_PASSWORD!,  // gmail app password (use app-specific password)
      },
    });

    // Set up email data
    const emailContent = {
      "bookingConfirmation": {
        "subject": "Booking Confirmation for Your [Ticket Type] Ticket(s)",
        "body": {
          "greeting": "Dear [Customer's Name],",
          "intro": "We are pleased to confirm that your purchase of the ticket(s) has been successfully received.",
          "paymentSummary": {
            "event": "Name of Event: [Ticket Type]",
            "bookingDate": "Date of Booking: [Booking Date]",
            "ticketType": "Ticket Type: [Ticket Type] Admission Ticket",
            "ticketCount": "Number of Tickets: [Ticket Count]",
            "amountPaid": "Total Amount: ¥[Amount Paid]",
            "ticketIds": "Ticket Ids: [Ticket Ids]",
            "paymentMethod": "Payment Method: [Payment Method]"
          },
          "confirmation": "Your ticket(s) are now confirmed! Thank you for your bookings. We would like to request you to complete payment within three days including booking day.\nOtherwise your booking ticket(s) will be cancelled automatically.",
          "questions": "If you have any questions or need assistance, feel free to reach out to us from (在沖縄ミャンマー人会) Facebook Page Messenger.",
          "closing": "We look forward to seeing you at the festival and sharing this exciting experience with you! 🌟",
          "signature": "Best regards,\nOkinawa Myanmar Association,Naha City, Okinawa Dist,Japan"
        }
      }
    }

    // Replace placeholders with actual data
    const emailBody = emailContent.bookingConfirmation.body;
    let subject = emailContent.bookingConfirmation.subject.replace('[Ticket Type]', ticketType);
    let emailText = emailBody.greeting.replace('[Customer\'s Name]', customerName) + '\n\n';
    emailText += emailBody.intro.replace('[Ticket Type]', ticketType) + '\n\n';
    emailText += `${emailBody.paymentSummary.event.replace('[Ticket Type]', ticketType)}\n`;
    emailText += `${emailBody.paymentSummary.bookingDate.replace('[Booking Date]', bookingDate)}\n`;
    emailText += `${emailBody.paymentSummary.ticketType.replace('[Ticket Type]', ticketType)}\n`;
    emailText += `${emailBody.paymentSummary.ticketCount.replace('[Ticket Count]', ticketCount)}\n`;
    emailText += `${emailBody.paymentSummary.amountPaid.replace('[Amount Paid]', amountPaid)}\n`;
    emailText += `${emailBody.paymentSummary.ticketIds.replace('[Ticket Ids]', ticketIds)}\n`;
    emailText += `${emailBody.paymentSummary.paymentMethod.replace('[Payment Method]', paymentMethod)}\n\n`;
    emailText += emailBody.confirmation + '\n';
    emailText += emailBody.questions + '\n\n';
    emailText += emailBody.closing + '\n\n';
    emailText += emailBody.signature;

    const mailOptions = {
      from: process.env.GMAIL_EMAIL,
      to: to,
      subject: subject,
      text: emailText,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Respond with success
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    // Handle errors if any occur
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
