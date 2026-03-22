import Link from "next/link";

interface GameCardProps {
  name: string;
  description: string;
  icon: string;
}

export function GameCard({ name, description, icon }: GameCardProps) {
  return (
    <Link href="/game-selection" className="group rounded-2xl border border-vortex-red-border bg-white p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vortex-red-soft text-xl font-bold text-vortex-red">{icon}</div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{name}</h3>
          <p className="text-sm text-slate-500">{description}</p>
        </div>
      </div>
    </Link>
  );
}
