import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { parseStoredTicketPayload } from "@/lib/ticketing";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const resolvedParams = await context.params;
    const id = resolvedParams?.id;
    if (!id) {
      return NextResponse.json({ error: "Ticket ID missing" }, { status: 400 });
    }

    const ticket = await prisma.ticket.findUnique({
      where: { id },
      include: {
        user: true,
        order: true,
      },
    });
    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 });
    }

    const parsedPayload = parseStoredTicketPayload(ticket.gamesSelected, {
      quantity: ticket.quantity,
      ticketUrl: ticket.ticketUrl,
      id: ticket.id,
    });

    return NextResponse.json({
      id: ticket.id,
      userId: ticket.userId,
      userName: ticket.user.name,
      gamesSelected: parsedPayload.gamesSelected,
      quantity: ticket.quantity,
      ticketUrl: ticket.ticketUrl,
      generatedTickets: parsedPayload.generatedTickets,
      amount: parsedPayload.amount,
      orderId: ticket.orderId,
      createdAt: ticket.createdAt,
    });
  } catch (error) {
    console.error("ticket router error", error);
    return NextResponse.json({ error: "Could not fetch ticket" }, { status: 500 });
  }
}
