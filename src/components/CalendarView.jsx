import FullCalendar from "@fullcalendar/react";

import dayGridPlugin from "@fullcalendar/daygrid";
import listPlugin from "@fullcalendar/list";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";

export default function CalendarView({
  fixtures,
  timeMode,
}) {
  const events = fixtures.map((match) => {
    const date =
      timeMode === "uae"
        ? match.date_uae || match.date
        : match.date;

    const time =
      timeMode === "uae"
        ? match.time_uae
        : match.time_local;

    return {
      id: String(match.match_number),

      title: `${match.home_team} vs ${match.away_team}`,

      start: `${date}T${time}:00`,

      extendedProps: {
        city: match.city,
        venue: match.venue,
        phase: match.phase,
        group: match.group,
      },
    };
  });

  return (
    <div className="overflow-hidden rounded-3xl bg-white p-4 shadow-sm">
      <FullCalendar
        plugins={[
          dayGridPlugin,
          listPlugin,
          timeGridPlugin,
          interactionPlugin,
        ]}
        initialView="dayGridMonth"
        height="auto"
        events={events}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right:
            "dayGridMonth,timeGridWeek,listWeek",
        }}
        eventTimeFormat={{
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }}
        eventClick={(info) => {
          alert(
            `${info.event.title}

${info.event.extendedProps.city}
${info.event.extendedProps.venue}

${info.event.extendedProps.phase}
${info.event.extendedProps.group}`
          );
        }}
      />
    </div>
  );
}
