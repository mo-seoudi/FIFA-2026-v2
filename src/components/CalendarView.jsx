import { Building2, CalendarDays, MapPin, Trophy, Users, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import teamSlots from "../data/teamSlots.json";
import stadiums from "../data/stadiums.json";

export default function CalendarView({
  fixtures,
  timeMode,
  flagMap,
  fifaCodeMap,
}) {
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

  const groupedDays = useMemo(() => {
    return groupMatchesByDate(fixtures, dateKey, timeKey);
  }, [fixtures, dateKey, timeKey]);

  return (
    <>
      <section className="space-y-6 md:space-y-8">
        <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-black tracking-tight sm:text-2xl">
                Tournament Calendar
              </h2>

              <p className="mt-1 text-sm text-neutral-500">
                June and July 2026 World Cup fixtures
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <div className="grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1">
                <button
                  onClick={() => setCalendarMode("cities")}
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
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
                  className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-black transition ${
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
                <div className="grid grid-cols-2 gap-1 rounded-2xl bg-neutral-100 p-1">
                  <button
                    onClick={() => setTeamDisplayMode("flags")}
                    className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-black transition ${
                      teamDisplayMode === "flags"
                        ? "bg-[#004b82] text-white shadow-sm"
                        : "text-neutral-600"
                    }`}
                  >
                    Flags
                  </button>

                  <button
                    onClick={() => setTeamDisplayMode("codes")}
                    className={`min-h-[44px] rounded-xl px-4 py-2 text-sm font-black transition ${
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
        </div>

        {/* Mobile agenda view */}
        <div className="space-y-4 md:hidden">
          {groupedDays.map((day) => (
            <MobileCalendarDay
              key={day.date}
              day={day}
              timeKey={timeKey}
              calendarMode={calendarMode}
              teamDisplayMode={teamDisplayMode}
              flagMap={flagMap}
              fifaCodeMap={fifaCodeMap}
              onSelectMatch={setSelectedMatch}
            />
          ))}
        </div>

        {/* Desktop calendar grid */}
        <div className="hidden space-y-8 md:block">
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

function MobileCalendarDay({
  day,
  timeKey,
  calendarMode,
  teamDisplayMode,
  flagMap,
  fifaCodeMap,
  onSelectMatch,
}) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-sm">
      <button
        onClick={() => setIsOpen((value) => !value)}
        className="flex w-full items-center justify-between gap-4 border-b border-neutral-100 px-4 py-4 text-left"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-2xl bg-[#004b82]/10 text-[#004b82]">
            <span className="text-xs font-black uppercase">
              {day.monthShort}
            </span>
            <span className="text-lg font-black leading-none">
              {day.dayNumber}
            </span>
          </div>

          <div>
            <h3 className="font-black text-neutral-950">{day.weekday}</h3>
            <p className="text-sm font-semibold text-neutral-500">
              {day.matches.length} {day.matches.length === 1 ? "match" : "matches"}
            </p>
          </div>
        </div>

        <span className="text-sm font-black text-[#004b82]">
          {isOpen ? "Hide" : "Show"}
        </span>
      </button>

      {isOpen && (
        <div className="space-y-2 p-3">
          {day.matches.map((match) => {
            const realVenue = stadiums[match.city] || match.venue;

            return (
              <button
                key={match.match_number}
                onClick={() => onSelectMatch(match)}
                className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 p-3 text-left transition active:scale-[0.99]"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-neutral-400">
                    M{match.match_number}
                  </span>

                  <span className="rounded-full bg-[#004b82]/10 px-3 py-1 text-sm font-black text-[#004b82]">
                    {match[timeKey]}
                  </span>
                </div>

                {calendarMode === "teams" ? (
                  <div className="space-y-2">
                    <MobileTeamLine
                      name={match.home_team}
                      code={flagMap?.[match.home_team]}
                      fifaCode={fifaCodeMap?.[match.home_team]}
                      displayMode={teamDisplayMode}
                    />

                    <div className="flex items-center gap-3">
                      <div className="h-px flex-1 bg-neutral-200" />
                      <span className="text-[10px] font-black uppercase tracking-[0.18em] text-neutral-400">
                        vs
                      </span>
                      <div className="h-px flex-1 bg-neutral-200" />
                    </div>

                    <MobileTeamLine
                      name={match.away_team}
                      code={flagMap?.[match.away_team]}
                      fifaCode={fifaCodeMap?.[match.away_team]}
                      displayMode={teamDisplayMode}
                    />
                  </div>
                ) : (
                  <div>
                    <p className="text-lg font-black text-neutral-950">
                      {match.city}
                    </p>

                    <p className="mt-1 text-sm font-semibold text-neutral-500">
                      {realVenue}
                    </p>
                  </div>
                )}

                <div className="mt-3 flex flex-wrap gap-1.5 text-xs font-bold text-neutral-500">
                  <span>{match.phase}</span>

                  {match.group && (
                    <>
                      <span>·</span>
                      <span>{match.group}</span>
                    </>
                  )}

                  {calendarMode === "teams" && (
                    <>
                      <span>·</span>
                      <span>{realVenue}</span>
                      <span>·</span>
                      <span>{match.city}</span>
                    </>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}

function MobileTeamLine({ name, code, fifaCode, displayMode }) {
  return (
    <div className="flex items-center gap-3">
      <TeamBadge
        code={code}
        fifaCode={fifaCode}
        name={name}
        displayMode={displayMode}
        size="mobile"
      />

      <span className="min-w-0 flex-1 truncate text-base font-black text-neutral-950">
        {name}
      </span>
    </div>
  );
}

function TeamBadge({ code, name, fifaCode, displayMode, size = "desktop" }) {
  const slot = teamSlots[name];

  const label = slot?.fifaCode || fifaCode || slot?.code || "TBD";

  if (displayMode === "codes") {
    return (
      <span
        title={slot?.team || name}
        className={`flex items-center justify-center rounded-sm bg-neutral-200 px-1 font-black leading-none text-neutral-700 shadow-sm ${
          size === "mobile"
            ? "h-6 min-w-10 text-[10px]"
            : "h-4 min-w-8 text-[8px]"
        }`}
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
        className={`fi fi-${slot.flag} rounded-sm shadow-sm ${
          size === "mobile" ? "h-5 w-7" : "h-4 w-6"
        }`}
      />
    );
  }

  if (!code && slot?.code) {
    return (
      <span
        title={name}
        className={`flex items-center justify-center rounded-sm bg-neutral-200 px-1 font-black leading-none text-neutral-700 shadow-sm ${
          size === "mobile"
            ? "h-6 min-w-10 text-[10px]"
            : "h-4 min-w-7 text-[8px]"
        }`}
      >
        {slot.code}
      </span>
    );
  }

  if (!code) {
    return (
      <span
        title={name}
        className={`flex items-center justify-center rounded-sm bg-neutral-200 px-1 font-black leading-none text-neutral-700 shadow-sm ${
          size === "mobile"
            ? "h-6 min-w-10 text-[10px]"
            : "h-4 min-w-7 text-[8px]"
        }`}
      >
        TBD
      </span>
    );
  }

  return (
    <span
      aria-label={`${name} flag`}
      title={fifaCode ? `${name} (${fifaCode})` : `${name} flag`}
      className={`fi fi-${code} rounded-sm shadow-sm ${
        size === "mobile" ? "h-5 w-7" : "h-4 w-6"
      }`}
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

  const isDifferentUaeDate =
    match.date_uae && match.date_uae !== match.date;

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
            <strong>Kick-off (UAE):</strong> {uaeDateLabel},{" "}
            {match.time_uae} (Dubai)
          </p>

          {isDifferentUaeDate && (
            <p className="mt-2 text-xs font-bold text-[#004b82]">
              This match falls on a different calendar date in UAE time.
            </p>
          )}
        </div>

        <div className="mt-5 grid gap-3 text-sm">
          <DetailRow
            icon={<MapPin size={17} />}
            label="City"
            value={match.city}
          />

          <DetailRow
            icon={<Building2 size={17} />}
            label="Venue"
            value={realVenue}
          />

          <DetailRow
            icon={<Trophy size={17} />}
            label="Stage"
            value={match.phase}
          />

          {match.group && (
            <DetailRow
              icon={<Users size={17} />}
              label="Group"
              value={match.group}
            />
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

function groupMatchesByDate(fixtures, dateKey, timeKey) {
  const grouped = fixtures.reduce((acc, match) => {
    const displayDate = match[dateKey] || match.date;

    if (!acc[displayDate]) {
      acc[displayDate] = [];
    }

    acc[displayDate].push(match);

    return acc;
  }, {});

  return Object.entries(grouped)
    .sort(([dateA], [dateB]) => dateA.localeCompare(dateB))
    .map(([date, matches]) => {
      const sortedMatches = [...matches].sort((a, b) => {
        const aTime = a[timeKey] || "";
        const bTime = b[timeKey] || "";

        return aTime.localeCompare(bTime);
      });

      const parsedDate = new Date(`${date}T12:00:00`);

      return {
        date,
        dayNumber: parsedDate.getDate(),
        weekday: new Intl.DateTimeFormat("en-GB", {
          weekday: "long",
        }).format(parsedDate),
        monthShort: new Intl.DateTimeFormat("en-GB", {
          month: "short",
        }).format(parsedDate),
        matches: sortedMatches,
      };
    });
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
