import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { createVisualTickets } from "@/lib/ticket-generator";
import { allocateTicketSequences } from "@/lib/ticket-sequence";
import { formatTicketId } from "@/lib/ticketing";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderRecordId,
      userName,
      gamesSelected,
      quantity,
      amount,
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !orderRecordId) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    const razorpaySecret = process.env.RAZORPAY_KEY_SECRET || "rzp_test_dummy_secret";
    const generatedSignature = crypto
      .createHmac("sha256", razorpaySecret)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generatedSignature !== razorpay_signature) {
      return NextResponse.json({ error: "Signature mismatch" }, { status: 400 });
    }

    const order = await prisma.order.findUnique({ where: { id: orderRecordId } });
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "paid") {
      return NextResponse.json({ error: "Order already paid" }, { status: 409 });
    }

    const user = await prisma.user.findFirst({ where: { name: userName } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const sequences = await allocateTicketSequences(quantity);
    const generatedTickets = await createVisualTickets({
      eventName: "VORTEX '26",
      userName,
      gamesSelected,
      orderId: order.id,
      amount,
      ticketIds: sequences.map((sequence) => ({
        sequence,
        ticketId: formatTicketId(sequence),
      })),
    });

    const ticket = await prisma.ticket.create({
      data: {
        userId: user.id,
        gamesSelected: JSON.stringify({ gamesSelected, generatedTickets, amount, quantity }),
        quantity,
        ticketUrl: "",
        orderId: order.id,
      },
    });

    const storedGeneratedTickets = generatedTickets.map((generatedTicket) => ({
      ...generatedTicket,
      ticketUrl: `/ticket/${ticket.id}?ticket=${generatedTicket.ticketId}`,
    }));

    await prisma.ticket.update({
      where: { id: ticket.id },
      data: {
        ticketUrl: `/ticket/${ticket.id}`,
        gamesSelected: JSON.stringify({
          gamesSelected,
          generatedTickets: storedGeneratedTickets,
          amount,
          quantity,
        }),
      },
    });

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: "paid",
        razorpay_payment_id,
        razorpay_signature,
      },
    });

    return NextResponse.json({
      success: true,
      ticketRecordId: ticket.id,
      ticketUrl: `/ticket/${ticket.id}`,
      generatedTickets: storedGeneratedTickets,
    });
  } catch (error) {
    console.error("verify-payment error", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
