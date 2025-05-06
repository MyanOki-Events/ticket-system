import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { to, bookingDate, amountPaid, paymentMethod, ticketType, ticketIds, ticketCount, customerName, emailType } = await req.json();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_EMAIL!, // sender email 
        pass: process.env.GMAIL_PASSWORD!,  // gmail app password (use app-specific password)
      },
    });

    if (emailType === "booking") {
      let paymentProcess= "";
      if (paymentMethod === "Bank Transfer") {
         paymentProcess = "Please find below the bank account details for processing your ticket payment:\n";
         paymentProcess+="Bank Name(銀行名): 沖縄銀行\n";
         paymentProcess+="Branch Code(店番号/支店名): 121/大道支店\n";
         paymentProcess+="Account Type(口座種類): 普通貯金口座\n";
         paymentProcess+="Account Number(口座番号): 2081873\n";
         paymentProcess+="Account Name(名前) ザイオキナワミャンマージンカイ\n\n";
         paymentProcess+="Once the payment is completed,please kindly send bank transfer receipt to (在沖縄ミャンマー人会) Facebook Page Messenger so we can issue your ticket.";
      } else {
        paymentProcess = "We’re pleased to inform you that you can complete your ticket payment in person. Please visit (Royal Myanmar Restaurant in Naha) to make your payment.";
      }
        // Set up email data
        const emailContent = {
          "bookingConfirmation": {
            "subject": "Booking Confirmation for Your [Ticket Type] Ticket(s)",
            "body": {
              "greeting": "Dear [Customer's Name],",
              "intro": "We are pleased to confirm that your booking of the ticket(s) has been successfully received.",
              "paymentSummary": {
                "event": "Name of Event: [Ticket Type]",
                "bookingDate": "Date of Booking: [Booking Date]",
                "ticketType": "Ticket Type: [Ticket Type] Admission Ticket",
                "ticketCount": "Number of Tickets: [Ticket Count]",
                "amountPaid": "Total Amount: ¥[Amount Paid]",
                "ticketIds": "Ticket Ids: [Ticket Ids]",
                "paymentMethod": "Payment Method: [Payment Method]"
              },
              "confirmation": "Your ticket(s) are now booked! Thank you for your bookings. We would like to request you to complete payment within [numberOfDays] days including booking day.\nOtherwise your booking ticket(s) will be cancelled automatically.",
              "paymentProcess": paymentProcess,
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
        emailText += `${emailBody.confirmation.replace('[numberOfDays]', process.env.NEXT_PUBLIC_TICKET_EXPIRE_DAY_LIMIT! )}\n\n`;
        emailText += emailBody.paymentProcess + '\n';
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
    } else if (emailType === "purchase") {
        const emailForPurchase = {
          "purchaseConfirmation": {
            "subject": " Your Ticket Purchase is Complete!",
            "body": {
              "greeting": "Dear [Customer's Name],",
              "intro": "We are excited to inform you that your ticket purchase for [Ticket Type] has been successfully completed!",
              "paymentSummary": {
                "event": "Name of Event: [Ticket Type]",
                "paidDate": "Date of Paid: [Paid Date]",
                "ticketType": "Ticket Type: [Ticket Type] Admission Ticket",
                "ticketId": "Ticket Id: [Ticket Ids]",
    
              },
              "howToCheck": "You can find your ticket(s) by accessing directly through your account on our Tickets Booking System.",
              "questions": "If you have any questions or need assistance, feel free to reach out to us from (在沖縄ミャンマー人会) Facebook Page Messenger.",
              "closing": "We look forward to seeing you at the festival and sharing this exciting experience with you! 🌟",
              "signature": "Best regards,\nOkinawa Myanmar Association,Naha City, Okinawa Dist,Japan"
            }
          }
        }

        // Replace placeholders with actual data
        const emailBody = emailForPurchase.purchaseConfirmation.body;
        let subject = emailForPurchase.purchaseConfirmation.subject.replace('[Ticket Type]', ticketType);
        let emailText = emailBody.greeting.replace('[Customer\'s Name]', customerName) + '\n\n';
        emailText += emailBody.intro.replace('[Ticket Type]', ticketType) + '\n\n';
        emailText += `${emailBody.paymentSummary.event.replace('[Ticket Type]', ticketType)}\n`;
        emailText += `${emailBody.paymentSummary.ticketType.replace('[Ticket Type]', ticketType)}\n`;
        emailText += `${emailBody.paymentSummary.ticketId.replace('[Ticket Ids]', ticketIds)}\n`;
        emailText += `${emailBody.paymentSummary.paidDate.replace('[Paid Date]', bookingDate)}\n\n`;
        emailText += emailBody.howToCheck + '\n';
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
    }

    // Respond with success
    return NextResponse.json({ message: 'Email sent successfully' }, { status: 200 });
  } catch (error) {
    // Handle errors if any occur
    return NextResponse.json({ error: 'Error sending email' }, { status: 500 });
  }
}
