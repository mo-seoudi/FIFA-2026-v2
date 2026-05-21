export default function CalendarView({ fixtures, timeMode, flagMap }) {
  const dateKey = timeMode === "uae" ? "date_uae" : "date";
  const timeKey = timeMode === "uae" ? "time_uae" : "time_local";

  const months = buildCalendarMonths(fixtures, dateKey, timeKey);

  return (
    <section className="space-y-6">
      {months.map((month) => (
        <div
          key={month.key}
          className="overflow-hidden rounded-3xl bg-white shadow-sm"
        >
          <div className="border-b border-neutral-200 bg-[#004b82] px-5 py-4 text-white">
            <h2 className="text-xl font-bold">{month.label}</h2>
            <p className="mt-1 text-xs font-medium text-white/70">
              {timeMode === "local"
                ? "Grouped by local stadium date"
                : "Grouped by UAE date"}
            </p>
          </div>

          <div className="grid grid-cols-7 bg-neutral-50 text-center text-[11px] font-bold uppercase tracking-wide text-neutral-500">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="border-b border-neutral-200 py-2">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7">
            {month.days.map((day) => (
              <div
                key={day.key}
                className={`min-h-[95px] border-b border-r border-neutral-200 p-1.5 ${
                  day.isEmpty ? "bg-neutral-50" : "bg-white"
                }`}
              >
                {!day.isEmpty && (
                  <>
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-neutral-800">
                        {day.dayNumber}
                      </span>

                      {day.matches.length > 1 && (
                        <span className="rounded-full bg-[#004b82]/10 px-1.5 py-0.5 text-[9px] font-bold text-[#004b82]">
                          {day.matches.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {day.matches.slice(0, 3).map((match) => (
                        <div
                          key={match.match_number}
                          className="rounded-lg bg-neutral-100 px-1.5 py-1 text-[10px] leading-tight"
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="font-bold text-[#004b82]">
                              {match[timeKey]}
                            </span>
                            <span className="text-[9px] font-bold text-neutral-400">
                              M{match.match_number}
                            </span>
                          </div>

                          <div className="mt-0.5 truncate font-semibold text-neutral-800">
                            {flagMap[match.home_team] || "🏳️"}{" "}
                            {shortTeam(match.home_team)}
                          </div>

                          <div className="truncate font-semibold text-neutral-800">
                            {flagMap[match.away_team] || "🏳️"}{" "}
                            {shortTeam(match.away_team)}
                          </div>
                        </div>
                      ))}

                      {day.matches.length > 3 && (
                        <div className="rounded-lg bg-neutral-900 px-1.5 py-1 text-center text-[10px] font-bold text-white">
                          +{day.matches.length - 3} more
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

function buildCalendarMonths(fixtures, dateKey, timeKey) {
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

  const monthKeys = [...new Set(dates.map((date) => date.slice(0, 7)))];

  return monthKeys.map((monthKey) => {
    const [year, month] = monthKey.split("-").map(Number);

    const firstOfMonth = new Date(year, month - 1, 1);
    const lastOfMonth = new Date(year, month, 0);

    const startOffset = (firstOfMonth.getDay() + 6) % 7;
    const calendarStart = new Date(firstOfMonth);
    calendarStart.setDate(firstOfMonth.getDate() - startOffset);

    const days = [];
    const current = new Date(calendarStart);

    while (current <= lastOfMonth || days.length % 7 !== 0) {
      const key = toDateKey(current);
      const isCurrentMonth = current.getMonth() === month - 1;

      days.push({
        key,
        dayNumber: current.getDate(),
        isEmpty: !isCurrentMonth,
        matches: isCurrentMonth ? grouped[key] || [] : [],
      });

      current.setDate(current.getDate() + 1);
    }

    return {
      key: monthKey,
      label: new Intl.DateTimeFormat("en-GB", {
        month: "long",
        year: "numeric",
      }).format(firstOfMonth),
      days,
    };
  });
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shortTeam(team) {
  const names = {
    "South Africa": "South Africa",
    "Korea Republic": "Korea Rep.",
    "Bosnia and Herzegovina": "Bosnia",
    "Côte d'Ivoire": "C. d'Ivoire",
    "Saudi Arabia": "Saudi",
    "Cabo Verde": "Cabo Verde",
    "New Zealand": "New Zealand",
    "DR Congo": "DR Congo",
  };

  return names[team] || team;
}
