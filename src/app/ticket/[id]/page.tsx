import { notFound } from "next/navigation";
import { buildTicketSvgDataUrl } from "@/lib/ticketing";

type TicketPageData = {
  id: string;
  userName: string;
  gamesSelected: string[];
  quantity: number;
  orderId: string;
  createdAt: string;
  generatedTickets: {
    ticketId: string;
    amount: number;
    gameLabel: string;
    eventName: string;
    ticketUrl: string;
    qrDataUrl?: string;
  }[];
};

async function getTicket(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/ticket/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    return null;
  }

  return (await res.json()) as TicketPageData;
}

export default async function TicketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ticket = await getTicket(id);

  if (!ticket) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#120b0f] px-4 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 rounded-[32px] border border-[#402530] bg-[radial-gradient(circle_at_top,_rgba(248,68,100,0.22),_transparent_42%),linear-gradient(135deg,_#201217,_#120b0f)] p-6 text-white shadow-[0_24px_80px_rgba(0,0,0,0.28)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.35em] text-[#ffb7c6]" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
            Ticket Vault
          </p>
          <h1 className="mt-3 text-4xl font-extrabold tracking-tight sm:text-6xl" style={{ fontFamily: "var(--font-montserrat)" }}>
            VORTEX &apos;26
          </h1>
          <p className="mt-2 text-base italic text-[#ffd9e1] sm:text-lg" style={{ fontFamily: "var(--font-cormorant)" }}>
            Visual tickets ready for entry and download
          </p>
          <div className="mt-6 grid gap-3 text-sm text-[#ffeef2] sm:grid-cols-3" style={{ fontFamily: "var(--font-source-sans)" }}>
            <p><strong>Booked by:</strong> {ticket.userName}</p>
            <p><strong>Tickets:</strong> {ticket.quantity}</p>
            <p><strong>Created:</strong> {new Date(ticket.createdAt).toLocaleString()}</p>
          </div>
        </header>

        <section className="grid gap-5">
          {ticket.generatedTickets.map((generatedTicket) => {
            const downloadUrl = buildTicketSvgDataUrl({
              eventName: generatedTicket.eventName,
              ticketId: generatedTicket.ticketId,
              gameLabel: generatedTicket.gameLabel,
              amount: generatedTicket.amount,
              userName: ticket.userName,
              orderId: ticket.orderId,
              qrDataUrl: generatedTicket.qrDataUrl,
            });

            return (
              <article
                id={generatedTicket.ticketId}
                key={generatedTicket.ticketId}
                className="overflow-hidden rounded-[30px] border border-[#f1bbc7] bg-[#fff7f9] shadow-[0_24px_50px_rgba(0,0,0,0.18)]"
              >
                <div className="grid gap-0 lg:grid-cols-[1.55fr_0.95fr]">
                  <div className="bg-[linear-gradient(135deg,_#231419,_#120b0f)] px-6 py-7 text-white sm:px-8">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#ffb7c6]" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                      Entry Pass
                    </p>
                    <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl" style={{ fontFamily: "var(--font-montserrat)" }}>
                      {generatedTicket.eventName}
                    </h2>
                    <p className="mt-2 text-base italic text-[#ffd9e1]" style={{ fontFamily: "var(--font-cormorant)" }}>
                      {generatedTicket.gameLabel}
                    </p>

                    <div className="mt-8 grid gap-5 sm:grid-cols-2" style={{ fontFamily: "var(--font-source-sans)" }}>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#f9b3c0]">Ticket ID</p>
                        <p className="mt-1 text-xl font-semibold" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                          {generatedTicket.ticketId}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#f9b3c0]">Amount</p>
                        <p className="mt-1 text-xl font-semibold">Rs {generatedTicket.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#f9b3c0]">Player</p>
                        <p className="mt-1 text-xl font-semibold">{ticket.userName}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-[#f9b3c0]">Order</p>
                        <p className="mt-1 text-sm font-semibold break-all" style={{ fontFamily: "var(--font-ibm-plex-mono)" }}>
                          {ticket.orderId}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-between bg-[#fff0f4] px-6 py-7 sm:px-8">
                    <div className="w-full rounded-[24px] border border-[#f0c8d0] bg-white p-4 shadow-sm">
                      {generatedTicket.qrDataUrl ? (
                        <img
                          src={generatedTicket.qrDataUrl}
                          alt={`QR for ${generatedTicket.ticketId}`}
                          className="mx-auto h-52 w-52 max-w-full object-contain"
                        />
                      ) : null}
                    </div>
                    <div className="mt-6 w-full space-y-3">
                      <a
                        href={downloadUrl}
                        download={`${generatedTicket.ticketId}.svg`}
                        className="block rounded-full bg-vortex-red px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-white transition hover:bg-vortex-red-hover"
                        style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                      >
                        Download Ticket
                      </a>
                      <a
                        href={`#${generatedTicket.ticketId}`}
                        className="block rounded-full border border-[#d99aa8] px-6 py-3 text-center text-sm font-bold uppercase tracking-[0.2em] text-[#7b3142] transition hover:bg-white"
                        style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
                      >
                        Ticket Ready
                      </a>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </section>
      </div>
    </main>
  );
}
