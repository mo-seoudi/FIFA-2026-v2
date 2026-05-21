import { useMemo, useState } from "react";

import fixtures from "../data/schedule.json";

import Header from "../components/Header";
import ScheduleFilters from "../components/ScheduleFilters";
import FixtureDayGroup from "../components/FixtureDayGroup";
import CalendarView from "../components/CalendarView";

const flagMap = {
  Mexico: "🇲🇽",
  "South Africa": "🇿🇦",
  "Korea Republic": "🇰🇷",
  Czechia: "🇨🇿",
  Canada: "🇨🇦",
  "Bosnia and Herzegovina": "🇧🇦",
  USA: "🇺🇸",
  Paraguay: "🇵🇾",
  Qatar: "🇶🇦",
  Switzerland: "🇨🇭",
  Brazil: "🇧🇷",
  Morocco: "🇲🇦",
  Haiti: "🇭🇹",
  Scotland: "🏴",
  Australia: "🇦🇺",
  Türkiye: "🇹🇷",
  Germany: "🇩🇪",
  Curaçao: "🇨🇼",
  Netherlands: "🇳🇱",
  Japan: "🇯🇵",
  Sweden: "🇸🇪",
  Tunisia: "🇹🇳",
  Spain: "🇪🇸",
  Uruguay: "🇺🇾",
  Belgium: "🇧🇪",
  Egypt: "🇪🇬",
  France: "🇫🇷",
  Senegal: "🇸🇳",
  Argentina: "🇦🇷",
  Portugal: "🇵🇹",
  England: "🏴",
  Croatia: "🇭🇷",
};

export default function Fifa() {
  const [query, setQuery] = useState("");
  const [groupFilter, setGroupFilter] = useState("ALL");
  const [timeMode, setTimeMode] = useState("local");
  const [viewMode, setViewMode] = useState("list");

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

      const matchesGroup = groupFilter === "ALL" || match.group === groupFilter;

      return matchesQuery && matchesGroup;
    });
  }, [query, groupFilter]);

  const groupedFixtures = useMemo(() => {
    return groupFixturesByDate(filteredFixtures);
  }, [filteredFixtures]);

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
              />
            ))}
          </section>
        ) : (
          <CalendarView
            fixtures={filteredFixtures}
            timeMode={timeMode}
            flagMap={flagMap}
          />
        )}
      </main>
    </div>
  );
}

function groupFixturesByDate(items) {
  return items.reduce((acc, match) => {
    if (!acc[match.date]) acc[match.date] = [];
    acc[match.date].push(match);
    return acc;
  }, {});
}