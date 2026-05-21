import { Trophy } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-[#004b82] text-white shadow-sm">
      {/* TOP BAR */}
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#004b82] shadow-sm">
            <Trophy size={25} />
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">
              FIFA World Cup 2026
            </p>

            <h1 className="text-xl font-bold tracking-tight">
              Scores & Fixtures
            </h1>
          </div>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden items-center gap-7 text-sm font-semibold md:flex">
          <a
            className="transition hover:text-white/75"
            href="#fixtures"
          >
            Fixtures
          </a>

          <a
            className="transition hover:text-white/75"
            href="#groups"
          >
            Groups
          </a>

          <a
            className="transition hover:text-white/75"
            href="#venues"
          >
            Venues
          </a>

          <button className="rounded-full border border-white/30 px-4 py-2 transition hover:bg-white/10">
            English
          </button>
        </nav>
      </div>

      {/* SUB NAV */}
      <div className="border-t border-white/10 bg-black">
        <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-5 py-4 text-sm font-bold uppercase tracking-wide">
          <span className="whitespace-nowrap text-white">
            FIFA World Cup 2026™
          </span>

          <span className="whitespace-nowrap text-white">
            Scores & Fixtures
          </span>

          <span className="whitespace-nowrap text-white/70">
            Standings
          </span>

          <span className="whitespace-nowrap text-white/70">
            Teams
          </span>

          <span className="whitespace-nowrap text-white/70">
            Host Countries and Cities
          </span>
        </div>
      </div>
    </header>
  );
}