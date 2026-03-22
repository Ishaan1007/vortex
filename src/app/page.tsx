"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

const featuredGames = [
  {
    name: "Carrom",
    image: "/images/ChatGPT Image Mar 21, 2026, 04_30_24 PM.png",
    alt: "Carrom event poster",
  },
  {
    name: "Ludo",
    image: "/images/ChatGPT Image Mar 21, 2026, 04_38_09 PM.png",
    alt: "Ludo event poster",
  },
  {
    name: "Badminton",
    image: "/images/ChatGPT Image Mar 21, 2026, 04_43_05 PM.png",
    alt: "Badminton event poster",
  },
] as const;

export default function Home() {
  const [activeIndex, setActiveIndex] = useState(1);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % featuredGames.length);
    }, 2800);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen overflow-x-hidden bg-white pb-24 sm:bg-black sm:p-10">
      <div className="mx-auto w-full max-w-full bg-white p-4 sm:max-w-4xl sm:rounded-lg sm:p-8 sm:shadow-xl">
        {/* Header */}
        <header className="mb-5 border-b border-gray-300 pb-3 sm:mb-8 sm:pb-6">
          <h1 className="text-[2.25rem] font-extrabold tracking-tight text-gray-700 sm:text-5xl sm:tracking-tight" style={{ fontFamily: "var(--font-montserrat)" }}>
            VORTEX &apos;26
          </h1>
          <p className="mt-1 text-sm italic text-vortex-red sm:mt-2 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
            Get pulled into the game
          </p>
        </header>

        {/* Featured Posters */}
        <section className="mb-7 sm:mb-8">
          <div className="mx-auto h-[260px] max-w-3xl sm:h-[430px]">
            <div className="relative h-full w-full overflow-hidden">
              {featuredGames.map((game, index) => {
                const offset = (index - activeIndex + featuredGames.length) % featuredGames.length;
                const position = offset === 0 ? "center" : offset === 1 ? "right" : "left";

                const positionClasses =
                  position === "center"
                    ? "left-1/2 z-20 w-[48%] -translate-x-1/2 scale-100 opacity-100 sm:w-[42%]"
                    : position === "left"
                      ? "left-[18%] z-10 w-[39%] -translate-x-1/2 scale-[0.93] opacity-80 sm:left-[24%] sm:w-[33%]"
                      : "left-[82%] z-10 w-[39%] -translate-x-1/2 scale-[0.93] opacity-80 sm:left-[76%] sm:w-[33%]";

                return (
                  <article
                    key={game.name}
                    className={[
                      "absolute top-1/2 aspect-[4/5] -translate-y-1/2 overflow-hidden rounded-[24px]",
                      "shadow-[0_18px_45px_rgba(0,0,0,0.26)] transition-[left,width,transform,opacity] duration-700 ease-out",
                      positionClasses,
                    ].join(" ")}
                  >
                    <Image
                      src={game.image}
                      alt={game.alt}
                      fill
                      priority={position === "center"}
                      sizes={position === "center" ? "(max-width: 640px) 48vw, 320px" : "(max-width: 640px) 39vw, 240px"}
                      className="object-cover object-center"
                    />
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* Event Info */}
        <section className="mb-6">
          <h2 className="text-[2rem] font-semibold leading-[0.95] text-gray-600 sm:text-3xl" style={{ fontFamily: "var(--font-cormorant)" }}>
            Indoor Games Event
          </h2>
          <p className="mt-1 text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)", fontStyle: "italic" }}>
            Organised by ~ CSE department
          </p>
        </section>

        {/* Game Details */}
        <section className="mb-8 space-y-6">
          <div>
            <h3 className="text-[2rem] font-bold tracking-tight text-vortex-red sm:text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
              LUDO
            </h3>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Timing:</strong> 10:00 - 11:00 am
            </p>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Location:</strong> UCOE basement
            </p>
          </div>
          <div>
            <h3 className="text-[2rem] font-bold tracking-tight text-vortex-red sm:text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
              CHESS
            </h3>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Timing:</strong> 11:00 - 12:00 am
            </p>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Location:</strong> UCOE basement
            </p>
          </div>
          <div>
            <h3 className="text-[2rem] font-bold tracking-tight text-vortex-red sm:text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
              CARROM
            </h3>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Timing:</strong> 12:00 - 01:00 pm
            </p>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Location:</strong> UCOE basement
            </p>
          </div>
          <div>
            <h3 className="text-[2rem] font-bold tracking-tight text-vortex-red sm:text-xl" style={{ fontFamily: "var(--font-montserrat)" }}>
              BADMINTON
            </h3>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Timing:</strong> 02:00 - 03:00 pm
            </p>
            <p className="text-sm text-gray-500 sm:text-base" style={{ fontFamily: "var(--font-source-sans)" }}>
              <strong>Location:</strong> UCOE court
            </p>
          </div>
        </section>

        {/* CTA Button */}
        <Link
          href="/game-selection"
          className="fixed inset-x-0 bottom-0 z-30 block w-full bg-vortex-red px-4 py-3 text-center text-[1.05rem] font-bold uppercase tracking-[0.12em] text-white shadow-[0_-10px_30px_rgba(0,0,0,0.22)] transition hover:bg-vortex-red-hover sm:static sm:rounded-full sm:px-6 sm:py-4 sm:text-lg sm:tracking-wider sm:shadow-lg"
          style={{ fontFamily: "var(--font-ibm-plex-mono)" }}
        >
          Grab Your Tickets Now
        </Link>
      </div>
    </main>
  );
}
