export default function CalendarView({ fixtures, timeMode, flagMap }) {
  const dateKey = timeMode === "uae" ? "date_uae" : "date";
  const timeKey = timeMode === "uae" ? "time_uae" : "time_local";

  const months = [
    buildTournamentMonth(2026, 5, fixtures, dateKey, timeKey), // June
    buildTournamentMonth(2026, 6, fixtures, dateKey, timeKey), // July
  ];

  return (
    <section className="space-y-8">
      {months.map((month) => (
        <div key={month.key} className="rounded-3xl bg-white p-4 shadow-sm">
          <div className="mb-4 flex items-end justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#004b82]">
                FIFA World Cup 2026
              </p>
              <h2 className="text-2xl font-black tracking-tight">
                {month.label}
              </h2>
            </div>

            <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600">
              {timeMode === "local" ? "Local dates" : "UAE dates"}
            </span>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-[10px] font-black uppercase tracking-wide text-neutral-400">
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
              <div key={day} className="py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="mt-1 grid grid-cols-7 gap-1">
            {month.days.map((day) => (
              <div
                key={day.key}
                className={`min-h-[86px] rounded-xl border p-1.5 ${
                  day.isCurrentMonth
                    ? day.matches.length > 0
                      ? "border-[#004b82]/20 bg-[#004b82]/5"
                      : "border-neutral-200 bg-white"
                    : "border-transparent bg-transparent"
                }`}
              >
                {day.isCurrentMonth && (
                  <>
                    <div className="mb-1 flex items-center justify-between">
                      <span
                        className={`text-xs font-black ${
                          day.matches.length > 0
                            ? "text-[#004b82]"
                            : "text-neutral-400"
                        }`}
                      >
                        {day.dayNumber}
                      </span>

                      {day.matches.length > 0 && (
                        <span className="rounded-full bg-[#004b82] px-1.5 py-0.5 text-[9px] font-black text-white">
                          {day.matches.length}
                        </span>
                      )}
                    </div>

                    <div className="space-y-1">
                      {day.matches.slice(0, 2).map((match) => (
                        <div
                          key={match.match_number}
                          className="rounded-lg bg-white px-1.5 py-1 text-[9px] leading-tight shadow-sm"
                          title={`${match.home_team} vs ${match.away_team}`}
                        >
                          <div className="mb-0.5 flex items-center justify-between gap-1">
                            <span className="font-black text-[#004b82]">
                              {match[timeKey]}
                            </span>
                            <span className="font-bold text-neutral-300">
                              M{match.match_number}
                            </span>
                          </div>

                          <div className="truncate font-bold text-neutral-800">
                            {flagMap[match.home_team] || "🏳️"}{" "}
                            {shortName(match.home_team)}
                          </div>

                          <div className="truncate font-bold text-neutral-800">
                            {flagMap[match.away_team] || "🏳️"}{" "}
                            {shortName(match.away_team)}
                          </div>
                        </div>
                      ))}

                      {day.matches.length > 2 && (
                        <div className="rounded-lg bg-neutral-900 px-1.5 py-1 text-center text-[9px] font-black text-white">
                          +{day.matches.length - 2} more
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

function buildTournamentMonth(year, monthIndex, fixtures, dateKey, timeKey) {
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

  const firstOfMonth = new Date(year, monthIndex, 1);
  const lastOfMonth = new Date(year, monthIndex + 1, 0);

  const startOffset = (firstOfMonth.getDay() + 6) % 7;

  const calendarStart = new Date(firstOfMonth);
  calendarStart.setDate(firstOfMonth.getDate() - startOffset);

  const days = [];
  const current = new Date(calendarStart);

  while (current <= lastOfMonth || days.length % 7 !== 0) {
    const key = toDateKey(current);
    const isCurrentMonth = current.getMonth() === monthIndex;

    days.push({
      key,
      dayNumber: current.getDate(),
      isCurrentMonth,
      matches: isCurrentMonth ? grouped[key] || [] : [],
    });

    current.setDate(current.getDate() + 1);
  }

  return {
    key: `${year}-${String(monthIndex + 1).padStart(2, "0")}`,
    label: new Intl.DateTimeFormat("en-GB", {
      month: "long",
      year: "numeric",
    }).format(firstOfMonth),
    days,
  };
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function shortName(team) {
  const names = {
    "South Africa": "S. Africa",
    "Korea Republic": "Korea",
    "Bosnia and Herzegovina": "Bosnia",
    "Côte d'Ivoire": "C. d'Ivoire",
    "Saudi Arabia": "Saudi",
    "Cabo Verde": "C. Verde",
    "New Zealand": "N. Zealand",
    "DR Congo": "DR Congo",
    "San Francisco Bay Area": "SF Bay",
  };

  return names[team] || team;
}
