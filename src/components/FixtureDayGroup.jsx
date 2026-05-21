import { CalendarDays, X } from "lucide-react";
import { useMemo, useState } from "react";

import fixtures from "../data/schedule.json";
import FixtureCard from "./FixtureCard";

const bracketPhases = [
  "Round of 32",
  "Round of 16",
  "Quarter-finals",
  "Semi-finals",
  "Third Place Match",
  "Final",
];

export default function FixtureDayGroup({
  date,
  matches,
  timeMode,
  flagMap,
}) {
  const [modalType, setModalType] = useState(null);

  const isKnockoutDay = matches.some((match) => match.phase !== "Group Stage");

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CalendarDays className="text-[#004b82]" size={20} />

          <h3 className="text-xl font-bold">{formatDayLabel(date)}</h3>
        </div>

        <button
          onClick={() => setModalType(isKnockoutDay ? "brackets" : "groups")}
          className="text-sm font-bold text-[#004b82] hover:underline"
        >
          {isKnockoutDay ? "View brackets" : "View groups"}
        </button>
      </div>

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

      {modalType === "groups" && (
        <GroupsModal onClose={() => setModalType(null)} />
      )}

      {modalType === "brackets" && (
        <BracketsModal onClose={() => setModalType(null)} />
      )}
    </section>
  );
}

function GroupsModal({ onClose }) {
  const groups = useMemo(() => {
    const grouped = {};

    fixtures
      .filter((match) => match.phase === "Group Stage" && match.group)
      .forEach((match) => {
        if (!grouped[match.group]) grouped[match.group] = new Set();

        grouped[match.group].add(match.home_team);
        grouped[match.group].add(match.away_team);
      });

    return Object.entries(grouped).map(([group, teams]) => ({
      group,
      teams: Array.from(teams),
    }));
  }, []);

  return (
    <ModalShell title="FIFA World Cup 2026™" subtitle="Groups" onClose={onClose}>
      <div className="grid gap-4 md:grid-cols-2">
        {groups.map(({ group, teams }) => (
          <div key={group} className="rounded-2xl border border-neutral-200 bg-white">
            <div className="border-b border-neutral-200 px-4 py-3">
              <h3 className="text-lg font-black text-[#07162f]">{group}</h3>
            </div>

            <div className="divide-y divide-neutral-100">
              {teams.map((team, index) => (
                <div key={team} className="flex items-center gap-3 px-4 py-3">
                  <span className="w-5 text-sm font-bold text-neutral-400">
                    {index + 1}
                  </span>
                  <span className="font-bold text-neutral-900">{team}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

function BracketsModal({ onClose }) {
  const [activePhase, setActivePhase] = useState("Round of 32");

  const phaseMatches = fixtures.filter((match) => match.phase === activePhase);

  return (
    <ModalShell
      title="FIFA World Cup 2026™"
      subtitle="Brackets"
      onClose={onClose}
    >
      <div className="mb-5 flex gap-2 overflow-x-auto pb-2">
        {bracketPhases.map((phase) => (
          <button
            key={phase}
            onClick={() => setActivePhase(phase)}
            className={`shrink-0 rounded-full border px-5 py-2 text-sm font-bold transition ${
              activePhase === phase
                ? "border-[#004b82] bg-[#004b82] text-white"
                : "border-neutral-200 bg-white text-neutral-700"
            }`}
          >
            {phase}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {phaseMatches.map((match) => (
          <div
            key={match.match_number}
            className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between text-xs font-bold text-neutral-500">
              <span>M{match.match_number}</span>
              <span>
                {formatShortDate(match.date)} · {match.time_local}
              </span>
            </div>

            <div className="space-y-2">
              <BracketTeam name={match.home_team} />
              <BracketTeam name={match.away_team} />
            </div>

            <div className="mt-3 text-xs font-semibold text-neutral-500">
              {match.city}
            </div>
          </div>
        ))}
      </div>
    </ModalShell>
  );
}

function BracketTeam({ name }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-neutral-50 px-3 py-2">
      <span className="h-4 w-6 rounded-sm border border-neutral-200 bg-white" />
      <span className="font-black text-neutral-900">{getBracketLabel(name)}</span>
    </div>
  );
}

function ModalShell({ title, subtitle, onClose, children }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/45 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[85vh] w-full max-w-5xl overflow-y-auto rounded-3xl bg-neutral-50 p-5 shadow-2xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#07162f]">
              {title}
            </h2>
            <p className="mt-1 text-sm font-semibold text-neutral-500">
              {subtitle}
            </p>
          </div>

          <button
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-neutral-400 transition hover:bg-neutral-100 hover:text-neutral-900"
          >
            <X size={24} />
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}

function getBracketLabel(name) {
  const winnerGroup = name.match(/^Winner Group ([A-L])$/);
  if (winnerGroup) return `1${winnerGroup[1]}`;

  const runnerUpGroup = name.match(/^Runner-up Group ([A-L])$/);
  if (runnerUpGroup) return `2${runnerUpGroup[1]}`;

  const thirdGroup = name.match(/^3rd Group (.+)$/);
  if (thirdGroup) return `3${thirdGroup[1]}`;

  const winnerMatch = name.match(/^Winner Match (\d+)$/);
  if (winnerMatch) return `W${winnerMatch[1]}`;

  const loserMatch = name.match(/^Loser Match (\d+)$/);
  if (loserMatch) return `L${loserMatch[1]}`;

  return name;
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

function formatShortDate(dateString) {
  const date = new Date(`${dateString}T12:00:00`);

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(date);
}
