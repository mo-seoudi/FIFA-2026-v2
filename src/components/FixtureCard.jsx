import stadiums from "../data/stadiums.json";

function TeamFlag({ code, name, size = "md" }) {
  if (!code) {
    return <span className="text-2xl leading-none">🏳️</span>;
  }

  const sizeClass = size === "sm" ? "h-4 w-6" : "h-6 w-8";

  return (
    <span
      aria-label={`${name} flag`}
      title={`${name} flag`}
      className={`fi fi-${code} ${sizeClass} rounded-sm shadow-sm`}
    />
  );
}

function TeamRow({ team, code, align = "left" }) {
  return (
    <div
      className={`flex items-center gap-3 ${
        align === "right" ? "justify-end text-right" : "justify-start text-left"
      }`}
    >
      {align === "left" && <TeamFlag code={code} name={team} />}

      <span className="min-w-0 flex-1 truncate text-base font-bold text-neutral-950 sm:text-lg">
        {team}
      </span>

      {align === "right" && <TeamFlag code={code} name={team} />}
    </div>
  );
}

export default function FixtureCard({ match, timeMode, flagMap }) {
  const realVenue = stadiums[match.city] || match.venue;
  const displayTime = timeMode === "local" ? match.time_local : match.time_uae;
  const displayTimeLabel = timeMode === "local" ? "Local" : "UAE";

  return (
    <article className="group overflow-hidden rounded-3xl bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:rounded-none md:p-5 md:px-8">
      {/* Mobile layout */}
      <div className="block p-4 md:hidden">
        <div className="mb-3 flex items-center justify-between gap-3">
          <span className="rounded-full bg-[#004b82]/10 px-3 py-1 text-xs font-black text-[#004b82]">
            M{match.match_number}
          </span>

          <div className="rounded-2xl bg-neutral-50 px-4 py-2 text-center">
            <p className="text-2xl font-black tabular-nums text-neutral-950">
              {displayTime}
            </p>

            <p className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
              {displayTimeLabel}
            </p>
          </div>
        </div>

        <div className="space-y-3 rounded-2xl bg-neutral-50 p-3">
          <TeamRow
            team={match.home_team}
            code={flagMap[match.home_team]}
            align="left"
          />

          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-neutral-200" />
            <span className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
              vs
            </span>
            <div className="h-px flex-1 bg-neutral-200" />
          </div>

          <TeamRow
            team={match.away_team}
            code={flagMap[match.away_team]}
            align="left"
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-semibold text-[#243b63]">
          <span>{match.phase}</span>

          {match.group && (
            <>
              <span>·</span>
              <span>{match.group}</span>
            </>
          )}

          <span>·</span>
          <span>{realVenue}</span>
          <span>·</span>
          <span>{match.city}</span>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="hidden md:block">
        <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
          <div className="flex items-center justify-end gap-3 text-right">
            <span className="text-lg font-semibold">{match.home_team}</span>
            <TeamFlag code={flagMap[match.home_team]} name={match.home_team} />
          </div>

          <div className="mx-auto min-w-[130px] rounded-2xl bg-neutral-50 px-5 py-3 text-center">
            <p className="text-3xl font-bold tabular-nums">{displayTime}</p>

            <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
              {displayTimeLabel}
            </p>
          </div>

          <div className="flex items-center justify-start gap-3">
            <TeamFlag code={flagMap[match.away_team]} name={match.away_team} />
            <span className="text-lg font-semibold">{match.away_team}</span>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm text-[#243b63]">
          <span>{match.phase}</span>

          {match.group && (
            <>
              <span>·</span>
              <span>{match.group}</span>
            </>
          )}

          <span>·</span>
          <span>{realVenue}</span>
          <span>·</span>
          <span>{match.city}</span>
        </div>
      </div>
    </article>
  );
}
