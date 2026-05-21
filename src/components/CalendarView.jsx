export default function CalendarView({ fixtures, timeMode, flagMap }) {
  const calendarDays = buildCalendarDays(fixtures);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">Calendar View</h2>
        <p className="mt-1 text-sm text-neutral-500">
          World Cup fixtures grouped by local match date.
        </p>
      </div>

      <div className="grid grid-cols-7 border-b border-r border-neutral-200 text-center text-xs font-bold uppercase tracking-wide text-neutral-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div key={day} className="border-l border-t border-neutral-200 p-3">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 border-r border-neutral-200">
        {calendarDays.map((day) => (
          <div
            key={day.key}
            className={`min-h-[150px] border-b border-l border-neutral-200 p-2 ${
              day.isEmpty ? "bg-neutral-50" : "bg-white"
            }`}
          >
            {!day.isEmpty && (
              <>
                <div className="mb-2 text-sm font-bold text-neutral-900">
                  {day.dayNumber}
                </div>

                <div className="space-y-2">
                  {day.matches.map((match) => (
                    <div
                      key={match.match_number}
                      className="rounded-xl bg-neutral-100 p-2 text-xs"
                    >
                      <div className="mb-1 font-bold text-[#004b82]">
                        {timeMode === "local" ? match.time_local : match.time_uae}
                      </div>

                      <div className="font-semibold leading-snug">
                        {flagMap[match.home_team] || "🏳️"} {match.home_team}
                      </div>

                      <div className="font-semibold leading-snug">
                        {flagMap[match.away_team] || "🏳️"} {match.away_team}
                      </div>

                      <div className="mt-1 truncate text-[11px] text-neutral-500">
                        {match.city}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function buildCalendarDays(fixtures) {
  const grouped = fixtures.reduce((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {});

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) return [];

  const firstDate = new Date(`${dates[0]}T12:00:00`);
  const lastDate = new Date(`${dates[dates.length - 1]}T12:00:00`);

  const firstMondayOffset = (firstDate.getDay() + 6) % 7;
  const calendarStart = new Date(firstDate);
  calendarStart.setDate(firstDate.getDate() - firstMondayOffset);

  const calendarDays = [];
  const current = new Date(calendarStart);

  while (current <= lastDate || calendarDays.length % 7 !== 0) {
    const dateKey = current.toISOString().slice(0, 10);

    calendarDays.push({
      key: dateKey,
      isEmpty: !grouped[dateKey],
      dayNumber: current.getDate(),
      matches: grouped[dateKey] || [],
    });

    current.setDate(current.getDate() + 1);
  }

  return calendarDays;
}
