"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const TEST_TICKET_PRICE = 5;

const games = [
  { name: "Ludo", price: TEST_TICKET_PRICE },
  { name: "Chess", price: TEST_TICKET_PRICE },
  { name: "Carrom", price: TEST_TICKET_PRICE },
  { name: "Badminton", price: TEST_TICKET_PRICE },
];

export default function GameSelectionPage() {
  const router = useRouter();
  const [counts, setCounts] = useState<Record<string, number>>({});

  const totalTickets = useMemo(() => Object.values(counts).reduce((sum, c) => sum + c, 0), [counts]);
  const totalPrice = totalTickets * TEST_TICKET_PRICE;

  const onIncrement = (name: string) => {
    setCounts((prev) => ({ ...prev, [name]: (prev[name] || 0) + 1 }));
  };

  const onDecrement = (name: string) => {
    setCounts((prev) => {
      const newValue = Math.max(0, (prev[name] || 0) - 1);
      return { ...prev, [name]: newValue };
    });
  };

  const onCheckout = () => {
    const selectedGames = games
      .map(({ name }) => ({ name, quantity: counts[name] || 0 }))
      .filter((item) => item.quantity > 0);

    if (!selectedGames.length) {
      alert("Select at least one ticket");
      return;
    }

    localStorage.setItem("vortex_booking", JSON.stringify({ selectedGames, totalTickets, totalPrice }));
    router.push("/checkout");
  };

  return (
    <main className="min-h-screen overflow-x-hidden bg-white py-4 sm:bg-black sm:p-10">
      <div className="mx-auto w-full max-w-full bg-white px-4 py-4 sm:max-w-3xl sm:rounded-[10px] sm:px-8 sm:py-8 sm:shadow-xl">
        <header className="mb-5 border-b border-gray-200 pb-3 sm:mb-8 sm:pb-6">
          <h1
            className="text-[2.25rem] font-extrabold tracking-tight text-gray-700 sm:text-5xl sm:tracking-tight"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            VORTEX &apos;26
          </h1>
          <p
            className="mt-1 text-sm italic text-vortex-red sm:mt-2 sm:text-base"
            style={{ fontFamily: "var(--font-source-sans)" }}
          >
            Get pulled into the game
          </p>
        </header>

        <section className="mb-6 sm:mb-8">
          <h2
            className="mb-5 text-[1.6rem] font-bold tracking-wide text-slate-800 sm:mb-6 sm:text-2xl"
            style={{ fontFamily: "var(--font-merriweather)" }}
          >
            PICK YOUR GAMES
          </h2>

          <div className="space-y-3">
            {games.map((game) => (
              <div
                key={game.name}
                className="flex items-center justify-between rounded-full border-2 border-vortex-red bg-white px-4 py-3 sm:px-6 sm:py-4"
              >
                <span
                  className="text-[0.92rem] font-semibold text-slate-800 sm:text-lg"
                  style={{ fontFamily: "var(--font-merriweather)" }}
                >
                  {game.name}
                </span>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => onDecrement(game.name)}
                    aria-label={`Decrease ${game.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-vortex-red text-[1.45rem] font-bold leading-none text-white transition hover:bg-vortex-red-hover sm:h-10 sm:w-10 sm:text-[1.6rem]"
                  >
                    -
                  </button>
                  <div
                    className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-slate-700 bg-white text-center text-[0.95rem] font-bold text-slate-800 sm:h-10 sm:w-10 sm:text-base"
                    style={{ fontFamily: "var(--font-lora)" }}
                  >
                    {counts[game.name] || 0}
                  </div>
                  <button
                    type="button"
                    onClick={() => onIncrement(game.name)}
                    aria-label={`Increase ${game.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-full bg-vortex-red text-[1.45rem] font-bold leading-none text-white transition hover:bg-vortex-red-hover sm:h-10 sm:w-10 sm:text-[1.6rem]"
                  >
                    +
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-[10px] bg-gradient-to-r from-vortex-red to-vortex-red-hover px-4 py-4 text-white sm:flex sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[0.82rem] opacity-90" style={{ fontFamily: "var(--font-merriweather)" }}>
                Tickets
              </p>
              <p className="text-[2rem] leading-none font-bold sm:text-3xl" style={{ fontFamily: "var(--font-merriweather)" }}>
                {totalTickets}
              </p>
            </div>
            <p className="text-[2rem] leading-none font-bold sm:hidden" style={{ fontFamily: "var(--font-merriweather)" }}>
              Rs {totalPrice}
            </p>
          </div>

          <div className="mt-3 flex items-center justify-end sm:mt-0 sm:contents">
            <div className="hidden text-right sm:block">
              <p className="text-3xl font-bold" style={{ fontFamily: "var(--font-merriweather)" }}>
                Rs {totalPrice}
              </p>
            </div>
            <button
              onClick={onCheckout}
              className="rounded-full bg-white px-8 py-2.5 text-[0.95rem] font-bold uppercase tracking-wide text-vortex-red transition hover:bg-gray-100 sm:px-8 sm:py-2 sm:text-sm"
              style={{ fontFamily: "Arial, sans-serif" }}
            >
              Get
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
