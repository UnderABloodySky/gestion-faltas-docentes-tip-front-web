'use client';

import styles from './absence-calendar.module.scss';
// import React from 'react';
import { DayClickEventHandler, DateRange } from 'react-day-picker';
import { eachDayOfInterval, isSameDay } from 'date-fns';

import { Calendar } from '@/components/ui/calendar';
import { Absence } from 'app/absence/page';

export interface AbsenceCalendarProps {
  listOfAbsences: Absence[];
  selectedDateRange?: DateRange;
  setSelectedAbsenceByDay: (day: Date) => void;
}

export interface AbsenceDays {
  absencesOneDay: Date[];
  absencesStartDay: Date[];
  absencesEndDay: Date[];
  absencesMiddleDay: Date[];
}

const absencesOneDayStyle = { border: '2px solid currentColor' };
const absencesStartDayStyle = {
  borderTop: '2px solid currentColor',
  borderBottom: '2px solid currentColor',
  borderLeft: '2px solid currentColor',
  borderTopRightRadius: 0,
  borderBottomRightRadius: 0,
};
const absencesEndDayStyle = {
  borderTop: '2px solid currentColor',
  borderBottom: '2px solid currentColor',
  borderRight: '2px solid currentColor',
  borderTopLeftRadius: 0,
  borderBottomLeftRadius: 0,
};
const absencesMiddleDayStyle = {
  borderTop: '2px solid currentColor',
  borderBottom: '2px solid currentColor',
  borderRadius: 0,
};

export function AbsenceCalendar({
  listOfAbsences,
  selectedDateRange,
  setSelectedAbsenceByDay,
}: AbsenceCalendarProps) {
  const {
    absencesOneDay,
    absencesStartDay,
    absencesEndDay,
    absencesMiddleDay,
  } = listOfAbsences.reduce(
    (daysOfAbsence: AbsenceDays, absence: Absence) => {
      if (isSameDay(absence.beginDate, absence.endDate)) {
        const currentAbsenceDays = eachDayOfInterval({
          start: absence.beginDate,
          end: absence.endDate,
        });
        daysOfAbsence.absencesOneDay = [
          ...daysOfAbsence.absencesOneDay,
          ...currentAbsenceDays,
        ];
      } else {
        daysOfAbsence.absencesStartDay = [
          ...daysOfAbsence.absencesStartDay,
          absence.beginDate,
        ];
        daysOfAbsence.absencesEndDay = [
          ...daysOfAbsence.absencesEndDay,
          absence.endDate,
        ];

        const middleAbsenceDays = eachDayOfInterval({
          start: absence.beginDate,
          end: absence.endDate,
        });
        if (middleAbsenceDays.length > 2) {
          middleAbsenceDays.shift();
          middleAbsenceDays.pop();
          daysOfAbsence.absencesMiddleDay = [
            ...daysOfAbsence.absencesMiddleDay,
            ...middleAbsenceDays,
          ];
        }
      }
      return daysOfAbsence;
    },
    {
      absencesOneDay: [],
      absencesStartDay: [],
      absencesEndDay: [],
      absencesMiddleDay: [],
    }
  );

  const handleDayClick: DayClickEventHandler = (day, modifiers) => {
    if (
      day &&
      (modifiers.absencesOneDay ||
        modifiers.absencesStartDay ||
        modifiers.absencesEndDay ||
        modifiers.absencesMiddleDay)
    ) {
      setSelectedAbsenceByDay(day);
    }
  };

  const isDayDisabled = (day: Date) => {
    return (
      !absencesOneDay.some((absenceDay) => isSameDay(absenceDay, day)) &&
      !absencesStartDay.some((absenceDay) => isSameDay(absenceDay, day)) &&
      !absencesEndDay.some((absenceDay) => isSameDay(absenceDay, day)) &&
      !absencesMiddleDay.some((absenceDay) => isSameDay(absenceDay, day))
    );
  };

  const footer = selectedDateRange ? '' : 'Seleccione una falta para editarla.';

  return (
    <div className={styles['container']}>
      <Calendar
        mode="range"
        selected={selectedDateRange}
        disabled={isDayDisabled}
        modifiers={{
          absencesOneDay,
          absencesStartDay,
          absencesEndDay,
          absencesMiddleDay,
        }}
        modifiersStyles={{
          absencesOneDay: absencesOneDayStyle,
          absencesStartDay: absencesStartDayStyle,
          absencesEndDay: absencesEndDayStyle,
          absencesMiddleDay: absencesMiddleDayStyle,
        }}
        onDayClick={handleDayClick}
        footer={footer}
        className="rounded-md border"
        classNames={{
          day_range_middle:
            'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        }}
      />
    </div>
  );
}

export default AbsenceCalendar;
