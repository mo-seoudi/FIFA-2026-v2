import {
  Building2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import stadiums from "../data/stadiums.json";
import teamSlots from "../data/teamSlots.json";

const monthOptions = [
  { label: "June 2026", year: 2026, monthIndex: 5 },
  { label: "July 2026", year: 2026, monthIndex: 6 },
];

export default function CalendarView2({
  fixtures,
  timeMode,
  flagMap,
  fifaCodeMap,
}) {
  const [activeMonthIndex, setActiveMonthIndex] = useState(0);
  const [calendarMode, setCalendarMode] = useState("cities");
  const [teamDisplayMode, setTeamDisplayMode] = useState("flags");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const activeMonth = monthOptions[activeMonthIndex];

  const dateKey = timeMode === "uae" ? "date_uae" : "date";
  const timeKey = timeMode === "uae" ? "time_uae" : "time_local";

  const month = useMemo(() => {
    return buildTournamentMonth(
      activeMonth.year,
      activeMonth.monthIndex,
      fixtures,
      dateKey,
      timeKey
    );
  }, [activeMonth, fixtures, dateKey, timeKey]);

  function goToPreviousMonth() {
    setActiveMonthIndex((current) => Math.max(0, current - 1));
  }

  function goToNextMonth() {
    setActiveMonthIndex((current) =>
      Math.min(monthOptions.length - 1, current + 1)
    );
  }

  return (
    <>
      <section className="space-y-5">
        <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight text-neutral-950 sm:text-2xl">
                Classic Calendar
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                Month grid view using {timeMode === "uae" ? "UAE" : "local"} dates
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1">
                <button
                  onClick={() => setCalendarMode("cities")}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                    calendarMode === "cities"
                      ? "bg-neutral-800 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Building2 size={16} />
                  Cities
                </button>

                <button
                  onClick={() => setCalendarMode("teams")}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
                    calendarMode === "teams"
                      ? "bg-neutral-800 text-white shadow-sm"
                      : "text-neutral-600 hover:bg-neutral-200"
                  }`}
                >
                  <Users size={16} />
                  Teams
                </button>
              </div>

              {calendarMode === "teams" && (
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1">
                  <button
                    onClick={() => setTeamDisplayMode("flags")}
                    className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-black transition ${
                      teamDisplayMode === "flags"
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    Flags
                  </button>

                  <button
                    onClick={() => setTeamDisplayMode("codes")}
                    className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-black transition ${
                      teamDisplayMode === "codes"
                        ? "bg-neutral-800 text-white shadow-sm"
                        : "text-neutral-600 hover:bg-neutral-200"
                    }`}
                  >
                    Codes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h3 className="text-lg font-black text-neutral-950 sm:text-xl">
              Month view
            </h3>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                disabled={activeMonthIndex === 0}
                className="flex min-h-[42px] items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-black text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40"
              >
                <ChevronLeft size={16} />
                Prev
              </button>

              <div className="min-w-[130px] rounded-2xl bg-neutral-100 px-4 py-2 text-center text-sm font-black text-neutral-800">
                {activeMonth.label}
              </div>

              <button
                onClick={goToNextMonth}
                disabled={activeMonthIndex === monthOptions.length - 1}
                className="flex min-h-[42px] items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-4 py-2 text-sm font-black text-neutral-700 transition hover:bg-neutral-100 disabled:opacity-40"
              >
                Next
                <ChevronRight size={16} />
              </button>

              {monthOptions.map((option, index) => (
                <button
                  key={option.label}
                  onClick={() => setActiveMonthIndex(index)}
                  className={`min-h-[42px] rounded-2xl border px-4 py-2 text-sm font-black transition ${
                    activeMonthIndex === index
                      ? "border-neutral-800 bg-neutral-800 text-white"
                      : "border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-100"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[720px] overflow-hidden rounded-3xl border border-neutral-200">
              <div className="grid grid-cols-7 bg-neutral-50 text-center text-sm font-black text-neutral-700">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                  <div
                    key={day}
                    className="border-r border-neutral-200 py-3 last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-px bg-neutral-200">
                {month.days.map((day) => (
                  <div
                    key={day.key}
                    className={`min-h-[115px] bg-white p-1.5 ${
                      day.isCurrentMonth ? "" : "bg-neutral-50 text-neutral-300"
                    }`}
                  >
                    <div className="mb-2 text-sm font-black">
                      {day.dayNumber}
                    </div>

                    {day.isCurrentMonth && (
                      <div className="space-y-1.5">
                        {day.matches.map((match, index) => (
                          <ClassicMatchPill
                            key={match.match_number}
                            match={match}
                            index={index}
                            timeKey={timeKey}
                            calendarMode={calendarMode}
                            teamDisplayMode={teamDisplayMode}
                            flagMap={flagMap}
                            fifaCodeMap={fifaCodeMap}
                            onClick={() => setSelectedMatch(match)}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-xs font-semibold text-neutral-500 md:hidden">
            Swipe horizontally to see the full month grid.
          </p>
        </div>
      </section>

      {selectedMatch && (
        <MatchModal
          match={selectedMatch}
          onClose={() => setSelectedMatch(null)}
        />
      )}
    </>
  );
}

function ClassicMatchPill({
  match,
  index,
  timeKey,
  calendarMode,
  teamDisplayMode,
  flagMap,
  fifaCodeMap,
  onClick,
}) {
  const colorClass =
    index % 2 === 0
      ? "bg-neutral-200 text-neutral-800 border border-neutral-300 hover:bg-neutral-300"
      : "bg-neutral-100 text-neutral-800 border border-neutral-300 hover:bg-neutral-200";

  if (calendarMode === "cities") {
    return (
      <button
        onClick={onClick}
        className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[10px] font-bold transition ${colorClass}`}
        title={`${match[timeKey]} · ${match.home_team} vs ${match.away_team}`}
      >
        <span className="mr-1 font-black">{match[timeKey]}</span>
        {match.city}
      </button>
    );
  }

  return (
    <button
      onClick={onClick}
      className="flex w-full items-center justify-between gap-1 rounded-md border border-neutral-300 bg-neutral-100 px-1.5 py-1 text-[10px] font-bold text-neutral-900 transition hover:bg-neutral-200"
      title={`${match[timeKey]} · ${match.home_team} vs ${match.away_team}`}
    >
      <span className="font-black text-neutral-700">{match[timeKey]}</span>

      <div className="flex min-w-0 items-center gap-1">
        <TeamBadge
          code={flagMap?.[match.home_team]}
          fifaCode={fifaCodeMap?.[match.home_team]}
          name={match.home_team}
          displayMode={teamDisplayMode}
        />

        <span className="text-[9px] font-black text-neutral-400">vs</span>

        <TeamBadge
          code={flagMap?.[match.away_team]}
          fifaCode={fifaCodeMap?.[match.away_team]}
          name={match.away_team}
          displayMode={teamDisplayMode}
        />
      </div>
    </button>
  );
}

function TeamBadge({ code, name, fifaCode, displayMode }) {
  const slot = teamSlots[name];
  const label = slot?.fifaCode || fifaCode || slot?.code || "TBD";

  if (displayMode === "codes") {
    return (
      <span
        title={slot?.team || name}
        className="flex h-4 min-w-8 items-center justify-center rounded-sm bg-neutral-100 px-1 text-[8px] font-black leading-none text-neutral-700 shadow-sm"
      >
        {label}
      </span>
    );
  }

  if (slot?.flag) {
    return (
      <span
        aria-label={`${slot.team || name} flag`}
        title={slot.team || name}
        className={`fi fi-${slot.flag} h-4 w-6 rounded-sm grayscale shadow-sm`}
      />
    );
  }

  if (!code && slot?.code) {
    return (
      <span
        title={name}
        className="flex h-4 min-w-7 items-center justify-center rounded-sm bg-neutral-100 px-1 text-[8px] font-black leading-none text-neutral-700 shadow-sm"
      >
        {slot.code}
      </span>
    );
  }

  if (!code) {
    return (
      <span
        title={name}
        className="flex h-4 min-w-7 items-center justify-center rounded-sm bg-neutral-100 px-1 text-[8px] font-black leading-none text-neutral-700 shadow-sm"
      >
        TBD
      </span>
    );
  }

  return (
    <span
      aria-label={`${name} flag`}
      title={fifaCode ? `${name} (${fifaCode})` : `${name} flag`}
      className={`fi fi-${code} h-4 w-6 rounded-sm grayscale shadow-sm`}
    />
  );
}

function MatchModal({ match, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const localDateLabel = formatDate(match.date);
  const uaeDateLabel = formatDate(match.date_uae || match.date);
  const isDifferentUaeDate = match.date_uae && match.date_uae !== match.date;
  const realVenue = stadiums[match.city] || match.venue;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 px-3 md:items-center md:px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[88vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl md:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-neutral-200 md:hidden" />

        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-500">
              Match #{match.match_number}
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-neutral-900">
              {match.home_team} vs {match.away_team}
            </h2>

            <p className="mt-1 text-sm font-medium text-neutral-500">
              {match.phase}
              {match.group ? ` · ${match.group}` : ""}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close match details"
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={22} />
          </button>
        </div>

        <div className="rounded-2xl bg-neutral-100 p-4 text-sm text-neutral-800">
          <p>
            <strong>Kick-off (Local):</strong> {localDateLabel},{" "}
            {match.time_local} ({match.city})
          </p>

          <p className="mt-2">
            <strong>Kick-off (UAE):</strong> {uaeDateLabel},{" "}
            {match.time_uae} (Dubai)
          </p>

          {isDifferentUaeDate && (
            <p className="mt-2 text-xs font-bold text-neutral-700">
              This match falls on a different calendar date in UAE time.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <DetailRow icon={<MapPin size={17} />} label="City" value={match.city} />

          <DetailRow
            icon={<Building2 size={17} />}
            label="Venue"
            value={realVenue}
          />

          <DetailRow icon={<Trophy size={17} />} label="Stage" value={match.phase} />

          {match.group && (
            <DetailRow icon={<Users size={17} />} label="Group" value={match.group} />
          )}
        </div>
      </div>
    </div>
  );
}

function DetailRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-neutral-500">{icon}</span>
      <strong className="min-w-[70px] text-neutral-900">{label}:</strong>
      <span className="text-neutral-600">{value}</span>
    </div>
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

function formatDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function toDateKey(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
