export default function CalendarView({ fixtures, timeMode, flagMap }) {
  const dateKey = timeMode === "uae" ? "date_uae" : "date";
  const timeKey = timeMode === "uae" ? "time_uae" : "time_local";

  const calendarDays = buildCalendarDays(fixtures, dateKey, timeKey);

  return (
    <section className="rounded-3xl bg-white p-5 shadow-sm">
      <div className="mb-5">
        <h2 className="text-2xl font-bold tracking-tight">
          Calendar View
        </h2>

        <p className="mt-1 text-sm text-neutral-500">
          {timeMode === "local"
            ? "Fixtures grouped by local stadium date."
            : "Fixtures grouped by UAE date."}
        </p>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 border-b border-r border-neutral-200 text-center text-xs font-bold uppercase tracking-wide text-neutral-500">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
          <div
            key={day}
            className="border-l border-t border-neutral-200 p-3"
          >
            {day}
          </div>
        ))}
      </div>

      {/* CALENDAR GRID */}
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
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm font-bold text-neutral-900">
                    {day.dayNumber}
                  </span>

                  {day.matches.length > 1 && (
                    <span className="rounded-full bg-[#004b82]/10 px-2 py-0.5 text-[10px] font-bold text-[#004b82]">
                      {day.matches.length} matches
                    </span>
                  )}
                </div>

                <div className="space-y-2">
                  {day.matches.map((match) => (
                    <div
                      key={match.match_number}
                      className="rounded-xl bg-neutral-100 p-2 text-xs transition hover:bg-neutral-200"
                    >
                      <div className="mb-1 flex items-center justify-between gap-2">
                        <span className="font-bold text-[#004b82]">
                          {match[timeKey]}
                        </span>

                        <span className="rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-neutral-500">
                          M{match.match_number}
                        </span>
                      </div>

                      <div className="font-semibold leading-snug">
                        {flagMap[match.home_team] || "🏳️"}{" "}
                        {match.home_team}
                      </div>

                      <div className="font-semibold leading-snug">
                        {flagMap[match.away_team] || "🏳️"}{" "}
                        {match.away_team}
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

function buildCalendarDays(fixtures, dateKey, timeKey) {
  const grouped = fixtures.reduce((acc, match) => {
    const displayDate = match[dateKey] || match.date;

    if (!acc[displayDate]) {
      acc[displayDate] = [];
    }

    acc[displayDate].push(match);

    return acc;
  }, {});

  Object.keys(grouped).forEach((date) => {
    grouped[date].sort((a, b) => {
      const aTime = a[timeKey] || "";
      const bTime = b[timeKey] || "";

      return aTime.localeCompare(bTime);
    });
  });

  const dates = Object.keys(grouped).sort();

  if (dates.length === 0) {
    return [];
  }

  const firstDate = new Date(`${dates[0]}T12:00:00`);
  const lastDate = new Date(`${dates[dates.length - 1]}T12:00:00`);

  const firstMondayOffset = (firstDate.getDay() + 6) % 7;

  const calendarStart = new Date(firstDate);
  calendarStart.setDate(firstDate.getDate() - firstMondayOffset);

  const calendarDays = [];
  const current = new Date(calendarStart);

  while (current <= lastDate || calendarDays.length % 7 !== 0) {
    const dateKeyValue = toDateKey(current);

    calendarDays.push({
      key: dateKeyValue,
      isEmpty: !grouped[dateKeyValue],
      dayNumber: current.getDate(),
      matches: grouped[dateKeyValue] || [],
    });

    current.setDate(current.getDate() + 1);
  }

  return calendarDays;
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
