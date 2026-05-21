import { CalendarDays, ChevronDown, Globe2, List, Search } from "lucide-react";

export default function ScheduleFilters({
  query,
  setQuery,
  groupFilter,
  setGroupFilter,
  groups,
  timeMode,
  setTimeMode,
  viewMode,
  setViewMode,
}) {
  return (
    <section className="mb-7 rounded-3xl bg-white p-5 shadow-sm">
      <div className="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Match Schedule</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Base schedule uses local stadium time. UAE time is shown as a secondary display.
          </p>
        </div>

        <label className="relative block min-w-[260px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search team, city, venue..."
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#004b82] focus:bg-white"
          />
        </label>

        <div className="flex gap-2 rounded-2xl bg-neutral-100 p-1">
          <button
            onClick={() => setTimeMode("local")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              timeMode === "local"
                ? "bg-[#004b82] text-white shadow-sm"
                : "text-neutral-600"
            }`}
          >
            Local
          </button>

          <button
            onClick={() => setTimeMode("uae")}
            className={`rounded-xl px-4 py-2 text-sm font-bold transition ${
              timeMode === "uae"
                ? "bg-[#004b82] text-white shadow-sm"
                : "text-neutral-600"
            }`}
          >
            UAE
          </button>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-600">
          <Globe2 size={16} />
          <span>
            {timeMode === "local"
              ? "Showing local stadium time"
              : "Showing UAE time"}
          </span>
        </div>

        <div className="relative">
          <select
            value={groupFilter}
            onChange={(event) => setGroupFilter(event.target.value)}
            className="appearance-none rounded-2xl border border-neutral-200 bg-white py-2 pl-4 pr-10 text-sm font-semibold outline-none focus:border-[#004b82]"
          >
            {groups.map((group) => (
              <option key={group} value={group}>
                {group === "ALL" ? "All groups" : group}
              </option>
            ))}
          </select>

          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500"
            size={16}
          />
        </div>

        <div className="flex gap-2 rounded-2xl bg-neutral-100 p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              viewMode === "list"
                ? "bg-black text-white shadow-sm"
                : "text-neutral-600"
            }`}
          >
            <List size={16} />
            List
          </button>

          <button
            onClick={() => setViewMode("calendar")}
            className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold transition ${
              viewMode === "calendar"
                ? "bg-black text-white shadow-sm"
                : "text-neutral-600"
            }`}
          >
            <CalendarDays size={16} />
            Calendar
          </button>
        </div>
      </div>
    </section>
  );
}
