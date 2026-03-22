interface TicketPreviewProps {
  userName: string;
  games: { name: string; quantity: number }[];
  totalPrice: number;
  totalTickets: number;
}

export function TicketPreview({ userName, games, totalPrice, totalTickets }: TicketPreviewProps) {
  return (
    <section className="rounded-2xl border border-vortex-red-border bg-white p-5 shadow-sm">
      <h2 className="text-xl font-semibold text-vortex-red">Ticket Preview</h2>
      <p className="mt-2 text-sm text-slate-500">VORTEX &apos;26 - Confirm details before payment.</p>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
        <p className="font-medium">Name: {userName || "(add name)"}</p>
        <p>Tickets: {totalTickets}</p>
        <p>Amount: ₹{totalPrice}</p>

        <div className="mt-3">
          <p className="font-medium">Games selected:</p>
          <ul className="list-disc pl-5 text-sm text-slate-700">
            {games.map((game) => (
              <li key={game.name}>
                {game.name} x {game.quantity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
