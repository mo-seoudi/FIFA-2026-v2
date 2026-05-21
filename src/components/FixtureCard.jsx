import stadiums from "../data/stadiums.json";

function TeamFlag({ code, name }) {
  if (!code) {
    return <span className="text-3xl leading-none">🏳️</span>;
  }

  return (
    <span
      aria-label={`${name} flag`}
      title={`${name} flag`}
      className={`fi fi-${code} h-6 w-8 rounded-sm shadow-sm`}
    />
  );
}

export default function FixtureCard({ match, timeMode, flagMap }) {
  const realVenue = stadiums[match.city] || match.venue;

  return (
    <article className="group bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md md:px-8">
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        <div className="flex items-center justify-end gap-3 text-right">
          <span className="text-lg font-semibold">{match.home_team}</span>
          <TeamFlag code={flagMap[match.home_team]} name={match.home_team} />
        </div>

        <div className="mx-auto min-w-[130px] rounded-2xl bg-neutral-50 px-5 py-3 text-center">
          <p className="text-3xl font-bold tabular-nums">
            {timeMode === "local" ? match.time_local : match.time_uae}
          </p>

          <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.2em] text-neutral-400">
            {timeMode === "local" ? "Local" : "UAE"}
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

        <span>
          {realVenue} ({match.city})
        </span>
      </div>
    </article>
  );
}
