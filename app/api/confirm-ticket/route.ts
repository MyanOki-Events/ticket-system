import { getTicketsByUserIdAndTicketIdOnce } from '@/app/services/ticket_service';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { paramOne, paramTwo } = await req.json();
        const result = await getTicketsByUserIdAndTicketIdOnce(paramOne, paramTwo);

        // Respond with success
        return NextResponse.json({ data: result, message: 'Ticket id is valid' }, { status: 200 });
    } catch (error) {
        // Handle errors if any occur
        return NextResponse.json({ error: 'Ticket id is not valid' }, { status: 500 });
    }
}
