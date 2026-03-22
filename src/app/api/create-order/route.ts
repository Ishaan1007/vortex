import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";
import { randomUUID } from "crypto";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_dummy",
      key_secret: process.env.RAZORPAY_KEY_SECRET || "rzp_test_dummy_secret",
    });

    const body = await request.json();
    const { amount, userName, gamesSelected, quantity } = body;

    if (!userName || !amount || !quantity || !Array.isArray(gamesSelected) || gamesSelected.length === 0) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }

    const priceInPaise = amount * 100;

    let user = await prisma.user.findFirst({ where: { name: userName } });
    if (!user) {
      user = await prisma.user.create({ data: { name: userName } });
    }

    const orderRecord = await prisma.order.create({
      data: {
        amount,
        status: "created",
        userId: user.id,
        razorpay_order_id: `pending_${randomUUID()}`,
      },
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: priceInPaise,
      currency: "INR",
      receipt: orderRecord.id,
      payment_capture: 1 as unknown as boolean,
    });

    await prisma.order.update({
      where: { id: orderRecord.id },
      data: {
        razorpay_order_id: razorpayOrder.id,
      },
    });

    return NextResponse.json({
      success: true,
      order: {
        razorpayOrderId: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      razorpayKey: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      orderRecordId: orderRecord.id,
    });
  } catch (error) {
    console.error("create-order error", error);

    const message = error instanceof Error ? error.message : "Could not create order";
    return NextResponse.json(
      { error: process.env.NODE_ENV === "development" ? message : "Could not create order" },
      { status: 500 },
    );
  }
}
