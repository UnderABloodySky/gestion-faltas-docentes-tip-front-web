'use client';

import styles from './big-calendar.module.scss';

import { useEffect, useRef, useState } from 'react';
import { add, format, parseISO, setHours } from 'date-fns';
import {
  formatDate,
  EventClickArg,
  EventContentArg,
  EventInput,
} from '@fullcalendar/core';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { absence_types } from '@/components/absence-form/absence-form';

import { AbsenseResponse } from 'app/absence/page';

import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

export interface BigCalendarProps {
  absences: AbsenseResponse[];
}

export function BigCalendar({ absences }: BigCalendarProps) {
  const [weekendsVisible, setWeekendsVisible] = useState(true);
  const [selectedAbsence, setSelectedAbsence] = useState<AbsenseResponse>();
  const [currentEvents, setCurrentEvents] = useState<Partial<EventInput>[]>([]);
  const triggerSheetRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const eventsFromAbsences = absences.map((absence) => {
      const articleLabel = absence_types.find(
        (art) => art.value === absence.article
      )?.label;
      // end date is exclusive in fullcalendar, so we need to push it 1 day
      const endDate = setHours(parseISO(absence.endDate), 0);
      const adjustedEndDate = add(endDate, { days: 1 });
      const parsedEndDate = format(adjustedEndDate, 'yyyy-MM-dd');
      return {
        id: absence.id.toString(),
        title: `${articleLabel} de ${absence.teacher.name}`,
        start: absence.beginDate,
        end: parsedEndDate,
      };
    });
    setCurrentEvents(eventsFromAbsences);
  }, [absences]);

  const handleWeekendsToggle = () => {
    setWeekendsVisible(!weekendsVisible);
  };

  const renderSidebar = () => {
    return (
      <div className="demo-app-sidebar">
        <div className="demo-app-sidebar-section">
          <label>
            <input
              type="checkbox"
              checked={weekendsVisible}
              onChange={handleWeekendsToggle}
            ></input>
            Mostrar fines de semana
          </label>
        </div>
        <div className="demo-app-sidebar-section">
          <h2>Cantidad de faltas ({currentEvents.length})</h2>
          <ul>{currentEvents.map(renderSidebarEvent)}</ul>
        </div>
      </div>
    );
  };

  // const handleDateSelect = (selectInfo: DateSelectArg) => {
  //     const title = prompt('Please enter a new title for your event')
  //     const calendarApi = selectInfo.view.calendar

  //     calendarApi.unselect() // clear date selection

  //     if (title) {
  //       calendarApi.addEvent({
  //         // id: createEventId(),
  //         title,
  //         start: selectInfo.startStr,
  //         end: selectInfo.endStr,
  //         allDay: selectInfo.allDay
  //       })
  //     }
  // }

  const handleEventClick = (clickInfo: EventClickArg) => {
    const selectedAbsenceId = Number(clickInfo.event.id);
    const selectedAbsence = absences.find(
      (absence) => absence.id === selectedAbsenceId
    );
    setSelectedAbsence(selectedAbsence);
    triggerSheetRef.current?.click();
  };

  // const handleEvents = (events: EventApi[]) => {
  //     console.log('🎉events: ', events);
  //     // setCurrentEvents(events);
  // }

  return (
    <div className={styles['container']}>
      {renderSidebar()}
      <div className="demo-app-main">
        <Sheet>
          <SheetTrigger asChild ref={triggerSheetRef}>
            <Button variant="outline" className="hidden">
              Abrir detalle de falta
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Detalle de la falta</SheetTitle>
              <SheetDescription>
                Datos de la falta y del docente.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="absence_type" className="text-right">
                  Tipo de falta
                </Label>
                <Input
                  id="absence_type"
                  disabled
                  value={
                    absence_types.find(
                      (art) => art.value === selectedAbsence?.article
                    )?.label
                  }
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="begin-date" className="text-right">
                  Fecha inicial
                </Label>
                <Input
                  id="begin-date"
                  disabled
                  value={selectedAbsence?.beginDate}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="end-date" className="text-right">
                  Fecha final
                </Label>
                <Input
                  id="end-date"
                  disabled
                  value={selectedAbsence?.endDate}
                  className="col-span-3"
                />
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher" className="text-right">
                  Docente
                </Label>
                <Input
                  id="teacher"
                  disabled
                  value={selectedAbsence?.teacher?.name}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="teacher_email" className="text-right">
                  Email del docente
                </Label>
                <Input
                  id="teacher_email"
                  disabled
                  value={selectedAbsence?.teacher?.email}
                  className="col-span-3"
                />
              </div>
            </div>
          </SheetContent>
        </Sheet>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          initialView="dayGridMonth"
          locale={esLocale}
          // editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={weekendsVisible}
          events={currentEvents}
          // initialEvents={INITIAL_EVENTS} // alternatively, use the `events` setting to fetch from a feed
          // select={handleDateSelect}
          eventContent={renderEventContent} // custom render function
          eventClick={handleEventClick}
          // eventsSet={handleEvents} // called after events are initialized/added/changed/removed
          /* you can update a remote database when these fire:
            eventAdd={function(){}}
            eventChange={function(){}}
            eventRemove={function(){}}
            */
        />
      </div>
    </div>
  );
}

function renderEventContent(eventInfo: EventContentArg) {
  return (
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  );
}

function renderSidebarEvent(event: Partial<EventInput>) {
  return (
    <li key={event.id}>
      <b>
        {event.start
          ? formatDate(event.start, {
              locale: 'es',
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })
          : 'Fecha invalida'}
      </b>
      <span> - </span>
      <i>{event.title}</i>
    </li>
  );
}

export default BigCalendar;
