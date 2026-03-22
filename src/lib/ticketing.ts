export const TICKET_PREFIX = "IP-410X";

export type GeneratedTicket = {
  ticketId: string;
  sequence: number;
  eventName: string;
  gameLabel: string;
  amount: number;
  ticketUrl: string;
  qrDataUrl?: string;
};

export type StoredTicketPayload = {
  gamesSelected: string[];
  generatedTickets: GeneratedTicket[];
  amount: number;
  quantity: number;
};

export function formatTicketId(sequence: number) {
  return `${TICKET_PREFIX}-${sequence.toString().padStart(3, "0")}`;
}

export function buildTicketSvgDataUrl(ticket: {
  eventName: string;
  ticketId: string;
  gameLabel: string;
  amount: number;
  userName: string;
  orderId: string;
  qrDataUrl?: string;
}) {
  const escaped = {
    eventName: escapeXml(ticket.eventName),
    ticketId: escapeXml(ticket.ticketId),
    gameLabel: escapeXml(ticket.gameLabel),
    amount: escapeXml(`Rs ${ticket.amount}`),
    userName: escapeXml(ticket.userName),
    orderId: escapeXml(ticket.orderId),
    qrDataUrl: ticket.qrDataUrl ?? "",
  };

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1200" height="675" viewBox="0 0 1200 675">
      <defs>
        <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fff8fa" />
          <stop offset="100%" stop-color="#ffe4ea" />
        </linearGradient>
      </defs>
      <rect width="1200" height="675" rx="36" fill="url(#bg)" />
      <rect x="28" y="28" width="1144" height="619" rx="28" fill="#ffffff" stroke="#f3b5c3" stroke-width="4" />
      <rect x="72" y="72" width="690" height="531" rx="26" fill="#1b1014" />
      <text x="118" y="156" fill="#f84464" font-size="54" font-weight="800" font-family="Montserrat, Arial, sans-serif">${escaped.eventName}</text>
      <text x="118" y="198" fill="#ffd7df" font-size="24" font-style="italic" font-family="Georgia, serif">Get pulled into the game</text>
      <text x="118" y="286" fill="#ffffff" font-size="30" font-weight="700" font-family="IBM Plex Mono, monospace">Ticket ID</text>
      <text x="118" y="326" fill="#f9b3c0" font-size="28" font-family="IBM Plex Mono, monospace">${escaped.ticketId}</text>
      <text x="118" y="398" fill="#ffffff" font-size="26" font-weight="700" font-family="IBM Plex Mono, monospace">Player</text>
      <text x="118" y="432" fill="#f0f0f0" font-size="30" font-family="Source Sans 3, Arial, sans-serif">${escaped.userName}</text>
      <text x="118" y="492" fill="#ffffff" font-size="26" font-weight="700" font-family="IBM Plex Mono, monospace">Game</text>
      <text x="118" y="526" fill="#f0f0f0" font-size="30" font-family="Source Sans 3, Arial, sans-serif">${escaped.gameLabel}</text>
      <text x="118" y="578" fill="#ffccd6" font-size="22" font-family="IBM Plex Mono, monospace">Order ${escaped.orderId}</text>
      <rect x="800" y="104" width="298" height="467" rx="28" fill="#fff6f8" stroke="#f3b5c3" stroke-width="3" />
      <text x="842" y="168" fill="#5d2330" font-size="24" font-weight="700" font-family="IBM Plex Mono, monospace">Entry Pass</text>
      <text x="842" y="212" fill="#8b4152" font-size="18" font-family="Source Sans 3, Arial, sans-serif">Present this ticket at the gate</text>
      ${escaped.qrDataUrl ? `<image href="${escaped.qrDataUrl}" x="844" y="246" width="210" height="210" />` : ""}
      <text x="842" y="504" fill="#5d2330" font-size="22" font-weight="700" font-family="IBM Plex Mono, monospace">Amount</text>
      <text x="842" y="536" fill="#f84464" font-size="42" font-weight="800" font-family="Montserrat, Arial, sans-serif">${escaped.amount}</text>
      <text x="842" y="584" fill="#8b4152" font-size="18" font-family="Source Sans 3, Arial, sans-serif">Valid for one verified entry only</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

export function parseStoredTicketPayload(raw: string, fallback: { quantity: number; ticketUrl: string; id: string }) {
  try {
    const parsed = JSON.parse(raw);

    if (Array.isArray(parsed)) {
      return {
        gamesSelected: parsed as string[],
        generatedTickets: [
          {
            ticketId: fallback.id,
            sequence: 0,
            eventName: "VORTEX '26",
            gameLabel: (parsed as string[]).join(", "),
            amount: 0,
            ticketUrl: fallback.ticketUrl,
            qrDataUrl: "",
          },
        ],
        amount: 0,
        quantity: fallback.quantity,
      } satisfies StoredTicketPayload;
    }

    if (parsed && typeof parsed === "object" && Array.isArray(parsed.generatedTickets)) {
      return parsed as StoredTicketPayload;
    }
  } catch {
    // Fall through to the legacy fallback shape below.
  }

  return {
    gamesSelected: [],
    generatedTickets: [
      {
        ticketId: fallback.id,
        sequence: 0,
        eventName: "VORTEX '26",
        gameLabel: "",
        amount: 0,
        ticketUrl: fallback.ticketUrl,
        qrDataUrl: "",
      },
    ],
    amount: 0,
    quantity: fallback.quantity,
  } satisfies StoredTicketPayload;
}

function escapeXml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}
