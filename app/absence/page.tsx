'use client';

import { useCallback, useEffect, useState } from 'react';
import { isWithinInterval, parseISO, setHours } from 'date-fns';
import { useAuth } from '@/components/auth/auth-context';

import AbsenceForm from '@/components/absence-form/absence-form';
import AbsenceCalendar from '@/components/absence-calendar/absence-calendar';

/* eslint-disable-next-line */
export interface AbsenceProps {}

export interface Absence {
  id: number;
  article: string;
  beginDate: Date;
  endDate: Date;
  teacher?: any;
}

export type AbsenseResponse = Omit<Absence, 'beginDate' | 'endDate'> & {
  beginDate: string; // Override beginDate as string
  endDate: string; // Override endDate as string
  teacher?: any; // TODO: remove once the backend doesn't send this anymore
};

export function Absence(props: AbsenceProps) {
  const { user } = useAuth();
  const [absences, setAbsences] = useState<Absence[]>([]);
  const [selectedAbsence, setSelectedAbsence] = useState<Absence>();

  // Define an async function to fetch the list of absences
  const fetchAbsences = useCallback(
    async (onSuccessfulFetch?: (updatedAbsences: Absence[]) => void) => {
      if (!user?.id) {
        return;
      }
      try {
        const response = await fetch(
          process.env.NEXT_PUBLIC_LACKS_URL + '/id-teacher/' + user?.id
        );

        if (!response.ok) {
          throw new Error('Fallo al traer las faltas.');
        }

        const fetchedAbsences: AbsenseResponse[] = await response.json();
        const parsedAbsencesWithoutTeacher = fetchedAbsences.map(
          ({ teacher, beginDate, endDate, ...rest }) => ({
            ...rest,
            beginDate: setHours(parseISO(beginDate), 0),
            endDate: setHours(parseISO(endDate), 0),
          })
        );
        onSuccessfulFetch && onSuccessfulFetch(parsedAbsencesWithoutTeacher);
        setAbsences(parsedAbsencesWithoutTeacher); // Update the state with the fetched absences (without the teacher info)
      } catch (error) {
        console.error('Error leyendo faltas:', error);
      }
    },
    [user?.id]
  );

  const onUpdateAbsenceSuccess = useCallback(() => {
    const updateSelectedAbsence = (updatedAbsences: Absence[]) => {
      if (selectedAbsence) {
        const updatedAbsence = updatedAbsences.find(
          (updatedAbsence) => updatedAbsence.id === selectedAbsence.id
        );
        setSelectedAbsence(updatedAbsence);
      }
    };
    fetchAbsences(updateSelectedAbsence);
  }, [selectedAbsence, fetchAbsences]);

  useEffect(() => {
    fetchAbsences();
  }, [fetchAbsences]);

  const selectAbsenceByDay = useCallback(
    (selectedDay: Date) => {
      const selectedAbsenceByDay = absences.find((absence) =>
        isWithinInterval(selectedDay, {
          start: absence.beginDate,
          end: absence.endDate,
        })
      );
      if (selectedAbsenceByDay?.id !== selectedAbsence?.id) {
        setSelectedAbsence(selectedAbsenceByDay);
      } else {
        setSelectedAbsence(undefined);
      }
    },
    [absences, selectedAbsence?.id]
  );

  return (
    <div className="flex flex-col sm:flex-row py-2 justify-around">
      <AbsenceForm
        existingAbsences={absences}
        selectedAbsence={selectedAbsence}
        onUpdateAbsenceSuccess={onUpdateAbsenceSuccess}
      />
      <AbsenceCalendar
        listOfAbsences={absences}
        selectedDateRange={
          selectedAbsence && {
            from: selectedAbsence.beginDate,
            to: selectedAbsence.endDate,
          }
        }
        setSelectedAbsenceByDay={selectAbsenceByDay}
      />
    </div>
  );
}

export default Absence;
