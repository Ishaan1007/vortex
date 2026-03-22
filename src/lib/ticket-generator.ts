import QRCode from "qrcode";
import type { GeneratedTicket } from "@/lib/ticketing";

export async function createVisualTickets(options: {
  userName: string;
  eventName: string;
  gamesSelected: string[];
  orderId: string;
  amount: number;
  ticketIds: { ticketId: string; sequence: number }[];
}) {
  const gameLabel = options.gamesSelected.join(", ");
  const perTicketAmount = Math.round((options.amount / options.ticketIds.length) * 100) / 100;

  const generatedTickets = await Promise.all(
    options.ticketIds.map(async ({ ticketId, sequence }) => {
      const qrPayload = JSON.stringify({
        ticketId,
        userName: options.userName,
        orderId: options.orderId,
      });
      const qrDataUrl = await QRCode.toDataURL(qrPayload, { margin: 1, width: 250 });

      return {
        ticketId,
        sequence,
        eventName: options.eventName,
        gameLabel,
        amount: perTicketAmount,
        qrDataUrl,
        ticketUrl: "",
      } satisfies GeneratedTicket;
    }),
  );

  return generatedTickets;
}
