import {
  CalendarDays,
  ChevronDown,
  Globe2,
  Grid3X3,
  List,
  Search,
  X,
} from "lucide-react";

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
    <section className="mb-6 rounded-3xl bg-white p-4 shadow-sm sm:p-5">
      <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-center">
        <div>
          <h2 className="text-xl font-black tracking-tight text-neutral-950 sm:text-2xl">
            Match Schedule
          </h2>

          <p className="mt-1 text-sm text-neutral-500">
            Base schedule uses local stadium time. UAE time is available too.
          </p>
        </div>

        <label className="relative block w-full lg:min-w-[300px]">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            size={18}
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search team, city, venue..."
            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 py-3 pl-10 pr-10 text-sm font-semibold outline-none transition focus:border-[#004b82] focus:bg-white"
          />

          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-neutral-400 transition hover:bg-neutral-200 hover:text-neutral-700"
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </label>

        <SegmentedControl
          value={timeMode}
          options={[
            { value: "local", label: "Local" },
            { value: "uae", label: "UAE" },
          ]}
          onChange={setTimeMode}
          color="blue"
        />
      </div>

      <div className="mt-4 grid gap-3 lg:flex lg:flex-wrap lg:items-center">
        <div className="flex min-h-[44px] items-center gap-2 rounded-2xl border border-neutral-200 bg-white px-3 py-2 text-sm font-semibold text-neutral-600">
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
            className="min-h-[44px] w-full appearance-none rounded-2xl border border-neutral-200 bg-white py-2 pl-4 pr-10 text-sm font-bold outline-none focus:border-[#004b82] lg:w-auto lg:min-w-[160px]"
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

        <SegmentedControl
          value={viewMode}
          options={[
            { value: "list", label: "List", icon: <List size={16} /> },
            {
              value: "calendar",
              label: "Calendar",
              icon: <CalendarDays size={16} />,
            },
            {
              value: "calendar2",
              label: "Classic",
              icon: <Grid3X3 size={16} />,
            },
          ]}
          onChange={setViewMode}
          color="black"
        />
      </div>
    </section>
  );
}

function SegmentedControl({ value, options, onChange, color }) {
  return (
    <div
      className={`grid gap-1 rounded-2xl bg-neutral-100 p-1 ${
        options.length === 3 ? "grid-cols-3" : "grid-cols-2"
      }`}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`flex min-h-[44px] items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-black transition sm:px-4 ${
              isActive
                ? color === "blue"
                  ? "bg-[#004b82] text-white shadow-sm"
                  : "bg-black text-white shadow-sm"
                : "text-neutral-600"
            }`}
          >
            {option.icon}
            <span className="hidden sm:inline">{option.label}</span>
            <span className="sm:hidden">{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}
