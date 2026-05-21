import { CalendarDays } from "lucide-react";

import FixtureCard from "./FixtureCard";

export default function FixtureDayGroup({
  date,
  matches,
  timeMode,
  flagMap,
}) {
  return (
    <section>
      {/* DAY HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays
            className="text-[#004b82]"
            size={20}
          />

          <h3 className="text-xl font-bold">
            {formatDayLabel(date)}
          </h3>
        </div>

        <button
          className="
            text-sm
            font-bold
            text-[#004b82]
            hover:underline
          "
        >
          View groups
        </button>
      </div>

      {/* MATCHES */}
      <div className="space-y-3">
        {matches.map((match) => (
          <FixtureCard
            key={match.match_number}
            match={match}
            timeMode={timeMode}
            flagMap={flagMap}
          />
        ))}
      </div>
    </section>
  );
}

function formatDayLabel(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}
