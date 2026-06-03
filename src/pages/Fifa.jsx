import { useMemo, useState } from "react";

import fixtures from "../data/schedule.json";
import teams from "../data/teams.json";

import Header from "../components/Header.jsx";
import ScheduleFilters from "../components/ScheduleFilters.jsx";
import FixtureDayGroup from "../components/FixtureDayGroup.jsx";
import CalendarView from "../components/CalendarView.jsx";
import CalendarView2 from "../components/CalendarView2.jsx";

const flagMap = Object.fromEntries(
  Object.entries(teams).map(([teamName, data]) => [teamName, data.flag])
);

const fifaCodeMap = Object.fromEntries(
  Object.entries(teams).map(([teamName, data]) => [teamName, data.fifaCode])
);

export default function Fifa() {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [timeMode, setTimeMode] = useState("local");
  const [viewMode, setViewMode] = useState("list");

  const dateKey = timeMode === "uae" ? "date_uae" : "date";

  const groups = useMemo(() => {
    return [
      "ALL",
      ...new Set(fixtures.map((match) => match.group).filter(Boolean)),
    ];
  }, []);

  const filteredFixtures = useMemo(() => {
    const q = query.trim().toLowerCase();

    return fixtures.filter((match) => {
      const matchesQuery =
        !q ||
        [
          match.home_team,
          match.away_team,
          match.venue,
          match.city,
          match.group,
          match.phase,
        ]
          .join(" ")
          .toLowerCase()
          .includes(q);

      const matchesGroup =
        groupFilter === "ALL" || match.group === groupFilter;

      return matchesQuery && matchesGroup;
    });
  }, [query, groupFilter]);

  const sortedFixtures = useMemo(() => {
    return [...filteredFixtures].sort((a, b) => {
      const aDate = timeMode === "uae" ? a.date_uae : a.date;
      const bDate = timeMode === "uae" ? b.date_uae : b.date;

      const aTime = timeMode === "uae" ? a.time_uae : a.time_local;
      const bTime = timeMode === "uae" ? b.time_uae : b.time_local;

      return `${aDate} ${aTime}`.localeCompare(`${bDate} ${bTime}`);
    });
  }, [filteredFixtures, timeMode]);

  const groupedFixtures = useMemo(() => {
    return groupFixturesByDate(sortedFixtures, dateKey);
  }, [sortedFixtures, dateKey]);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-950">
      <Header />

      <main id="fixtures" className="mx-auto max-w-7xl px-5 py-8">
        <ScheduleFilters
          query={query}
          setQuery={setQuery}
          groupFilter={groupFilter}
          setGroupFilter={setGroupFilter}
          groups={groups}
          timeMode={timeMode}
          setTimeMode={setTimeMode}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        {viewMode === "list" ? (
          <section className="space-y-7">
            {Object.entries(groupedFixtures).map(([date, matches]) => (
              <FixtureDayGroup
                key={date}
                date={date}
                matches={matches}
                timeMode={timeMode}
                flagMap={flagMap}
                fifaCodeMap={fifaCodeMap}
              />
            ))}
          </section>
        ) : viewMode === "calendar" ? (
          <CalendarView
            fixtures={sortedFixtures}
            timeMode={timeMode}
            flagMap={flagMap}
            fifaCodeMap={fifaCodeMap}
          />
        ) : (
          <CalendarView2
            fixtures={sortedFixtures}
            timeMode={timeMode}
            flagMap={flagMap}
            fifaCodeMap={fifaCodeMap}
          />
        )}
      </main>
    </div>
  );
}

function groupFixturesByDate(items, dateKey) {
  return items.reduce((acc, match) => {
    const displayDate = match[dateKey] || match.date;

    if (!acc[displayDate]) acc[displayDate] = [];

    acc[displayDate].push(match);

    return acc;
  }, {});
}
