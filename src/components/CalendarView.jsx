import { Building2, MapPin, Trophy, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import teamSlots from "../data/teamSlots.json";

export default function CalendarView({ fixtures, timeMode, flagMap, fifaCodeMap }) {
  const [calendarMode, setCalendarMode] = useState("cities");
  const [teamDisplayMode, setTeamDisplayMode] = useState("flags");
  const [selectedMatch, setSelectedMatch] = useState(null);

  const dateKey = timeMode === "uae" ? "date_uae" : "date";
  const timeKey = timeMode === "uae" ? "time_uae" : "time_local";

  const months = useMemo(() => {
    return [
      buildTournamentMonth(2026, 5, fixtures, dateKey, timeKey),
      buildTournamentMonth(2026, 6, fixtures, dateKey, timeKey),
    ];
  }, [fixtures, dateKey, timeKey]);

  return (
    <>
      <section className="space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white p-4 shadow-sm">
          <div>
            <h2 className="text-xl font-black tracking-tight">
              Tournament Calendar
            </h2>
            <p className="text-sm text-neutral-500">
              June and July 2026 World Cup fixtures
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <div className="flex gap-2 rounded-2xl bg-neutral-100 p-1">
              <button
                onClick={() => setCalendarMode("cities")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                  calendarMode === "cities"
                    ? "bg-[#004b82] text-white shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <Building2 size={16} />
                Cities
              </button>

              <button
                onClick={() => setCalendarMode("teams")}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
                  calendarMode === "teams"
                    ? "bg-[#004b82] text-white shadow-sm"
                    : "text-neutral-600"
                }`}
              >
                <Users size={16} />
                Teams
              </button>
            </div>

            {calendarMode === "teams" && (
              <div className="flex gap-2 rounded-2xl bg-neutral-100 p-1">
                <button
                  onClick={() => setTeamDisplayMode("flags")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    teamDisplayMode === "flags"
                      ? "bg-[#004b82] text-white shadow-sm"
                      : "text-neutral-600"
                  }`}
                >
                  Flags
                </button>

                <button
                  onClick={() => setTeamDisplayMode("codes")}
                  className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
                    teamDisplayMode === "codes"
                      ? "bg-[#004b82] text-white shadow-sm"
                      : "text-neutral-600"
                  }`}
                >
                  Codes
                </button>
              </div>
            )}
          </div>
        </div>

        {months.map((month) => (
          <div
            key={month.key}
            className="overflow-hidden rounded-3xl bg-white shadow-sm"
          >
            <div className="border-b border-neutral-200 px-5 py-4">
              <h3 className="text-2xl font-black tracking-tight text-[#07162f]">
                {month.label}
              </h3>
            </div>

            <div className="grid grid-cols-7 bg-neutral-50 text-center text-xs font-black text-neutral-600">
              {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => (
                <div key={day} className="border-r border-neutral-200 py-2">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {month.days.map((day) => (
                <div
                  key={day.key}
                  className={`min-h-[122px] border-r border-t border-neutral-200 p-2 ${
                    day.isCurrentMonth ? "bg-white" : "bg-neutral-50"
                  }`}
                >
                  {day.isCurrentMonth && (
                    <>
                      <div className="mb-2 text-sm font-black text-neutral-900">
                        {day.dayNumber}
                      </div>

                      <div className="space-y-1.5">
                        {day.matches.map((match) => (
                          <button
                            key={match.match_number}
                            onClick={() => setSelectedMatch(match)}
                            className="w-full rounded-lg border border-[#004b82]/15 bg-[#004b82]/5 px-2 py-1.5 text-left transition hover:border-[#004b82]/40 hover:bg-[#004b82]/10"
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs font-black text-[#004b82]">
                                {match[timeKey]}
                              </span>

                              <span className="text-[10px] font-black text-neutral-300">
                                M{match.match_number}
                              </span>
                            </div>

                            <div className="mt-1">
                              {calendarMode === "teams" ? (
                                <div className="flex items-center justify-center gap-1.5">
                                  <TeamBadge
                                    code={flagMap?.[match.home_team]}
                                    fifaCode={fifaCodeMap?.[match.home_team]}
                                    name={match.home_team}
                                    displayMode={teamDisplayMode}
                                  />

                                  <span className="text-[10px] font-black uppercase text-neutral-400">
                                    vs
                                  </span>

                                  <TeamBadge
                                    code={flagMap?.[match.away_team]}
                                    fifaCode={fifaCodeMap?.[match.away_team]}
                                    name={match.away_team}
                                    displayMode={teamDisplayMode}
                                  />
                                </div>
                              ) : (
                                <div className="truncate text-[11px] font-bold text-neutral-900">
                                  {match.city}
                                </div>
                              )}
                            </div>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
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

function TeamBadge({ code, name, fifaCode, displayMode }) {
  const slot = teamSlots[name];

  const label = slot?.fifaCode || fifaCode || slot?.code || "TBD";

  if (displayMode === "codes") {
    return (
      <span
        title={slot?.team || name}
        className="flex h-4 min-w-8 items-center justify-center rounded-sm bg-neutral-200 px-1 text-[8px] font-black leading-none text-neutral-700 shadow-sm"
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
        className={`fi fi-${slot.flag} h-4 w-6 rounded-sm shadow-sm`}
      />
    );
  }

  if (!code && slot?.code) {
    return (
      <span
        title={name}
        className="flex h-4 min-w-7 items-center justify-center rounded-sm bg-neutral-200 px-1 text-[8px] font-black leading-none text-neutral-700 shadow-sm"
      >
        {slot.code}
      </span>
    );
  }

  if (!code) {
    return (
      <span
        title={name}
        className="flex h-4 min-w-7 items-center justify-center rounded-sm bg-neutral-200 px-1 text-[8px] font-black leading-none text-neutral-700 shadow-sm"
      >
        TBD
      </span>
    );
  }

  return (
    <span
      aria-label={`${name} flag`}
      title={fifaCode ? `${name} (${fifaCode})` : `${name} flag`}
      className={`fi fi-${code} h-4 w-6 rounded-sm shadow-sm`}
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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-xl rounded-3xl bg-white p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-neutral-500">
              Match #{match.match_number}
            </p>

            <h2 className="mt-1 text-2xl font-black tracking-tight text-[#07162f]">
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

        <div className="rounded-2xl bg-neutral-100 p-4 text-sm">
          <p>
            <strong>Kick-off (Local):</strong> {localDateLabel},{" "}
            {match.time_local} ({match.city})
          </p>

          <p className="mt-2">
            <strong>Kick-off (UAE):</strong> {uaeDateLabel}, {match.time_uae}{" "}
            (Dubai)
          </p>

          {isDifferentUaeDate && (
            <p className="mt-2 text-xs font-bold text-[#004b82]">
              This match falls on a different calendar date in UAE time.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <DetailRow icon={<MapPin size={17} />} label="City" value={match.city} />

          <DetailRow
            icon={<Building2 size={17} />}
            label="Venue"
            value={match.venue}
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
      <span className="text-[#004b82]">{icon}</span>
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
