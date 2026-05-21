export default function FixtureCard({
  match,
  timeMode,
  flagMap,
}) {
  return (
    <article
      className="
        group
        bg-white
        p-5
        shadow-sm
        transition
        hover:-translate-y-0.5
        hover:shadow-md
        md:px-8
      "
    >
      <div className="grid items-center gap-4 md:grid-cols-[1fr_auto_1fr]">
        {/* HOME TEAM */}
        <div className="flex items-center justify-end gap-3 text-right">
          <span className="text-lg font-semibold">
            {match.home_team}
          </span>

          <span className="text-3xl leading-none">
            {flagMap[match.home_team] || "🏳️"}
          </span>
        </div>

        {/* TIME */}
        <div
          className="
            mx-auto
            min-w-[130px]
            rounded-2xl
            bg-neutral-50
            px-5
            py-3
            text-center
          "
        >
          <p className="text-3xl font-bold tabular-nums">
            {timeMode === "local"
              ? match.time_local
              : match.time_uae}
          </p>

          <p
            className="
              mt-1
              text-[11px]
              font-bold
              uppercase
              tracking-[0.2em]
              text-neutral-400
            "
          >
            {timeMode === "local"
              ? "Local"
              : "UAE"}
          </p>
        </div>

        {/* AWAY TEAM */}
        <div className="flex items-center justify-start gap-3">
          <span className="text-3xl leading-none">
            {flagMap[match.away_team] || "🏳️"}
          </span>

          <span className="text-lg font-semibold">
            {match.away_team}
          </span>
        </div>
      </div>

      {/* MATCH INFO */}
      <div
        className="
          mt-4
          flex
          flex-wrap
          items-center
          justify-center
          gap-2
          text-sm
          text-[#243b63]
        "
      >
        <span>{match.phase}</span>

        <span>·</span>

        <span>{match.group}</span>

        <span>·</span>

        <span>
          {match.venue} ({match.city})
        </span>
      </div>
    </article>
  );
}
