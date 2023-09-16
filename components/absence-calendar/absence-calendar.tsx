'use client';

import styles from './absence-calendar.module.scss';
import React from 'react';
import { DayClickEventHandler } from 'react-day-picker';
import { eachDayOfInterval } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';

export interface Absence {
  id: number,
  article: string,
  beginDate: Date,
  endDate: Date,
}

/* eslint-disable-next-line */
export interface AbsenceCalendarProps {
  listOfAbsences: Absence[],
  selectedAbsence: Absence,
  setSelectedAbsenceByDay: (day: Date) => void,
}

const absenceDays = [new Date(2023, 8, 12), new Date(2023, 8, 19)];
const absenceStyle = { border: '2px solid currentColor' };

export function AbsenceCalendar({
  listOfAbsences,
  selectedAbsence,
  setSelectedAbsenceByDay,
}: AbsenceCalendarProps) {
  // const [absence, setAbsence] = React.useState(false);
  // const absenceDays: Date[] = listOfAbsences.reduce((daysOfAbsence: Date[], absence: Absence) => {
  //   const currentAbsenceDays = eachDayOfInterval({ start: absence.beginDate, end: absence.endDate })
  //   return [...daysOfAbsence, ...currentAbsenceDays]
  // }, [])

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (day && modifiers.absence) {
      setSelectedAbsenceByDay(day)
    }
  };

  const footer = selectedAbsence
    ? ''
    : 'Seleccione una falta para editarla.';

  return (
    <div className={styles['container']}>
      <Calendar
        mode="single"
        // selected={date}
        // onSelect={setDate}
        modifiers={{ absence: absenceDays }}
        modifiersStyles={{ absence: absenceStyle }}
        onDayClick={handleDayClick}
        footer={footer}
        className="rounded-md border"
      />
    </div>
  );
}

export default AbsenceCalendar;
