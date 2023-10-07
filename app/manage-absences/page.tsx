'use client';

import styles from './page.module.scss';

import { useState } from 'react';
import { parseISO, setHours } from 'date-fns';

import { User } from '@/components/auth/auth-context';
import BigCalendar from '@/components/big-calendar/big-calendar';
import SearchResultsOptions, {
  OptionType, Subject,
} from '@/components/search-results-options/search-results-options';
import Absence, { AbsenseResponse } from 'app/absence/page';

/* eslint-disable-next-line */
export interface ManageAbsencesProps {}

export function ManageAbsences(props: ManageAbsencesProps) {
  const [foundTeachers, setFoundTeachers] = useState<User[]>([]);
  const [foundSubjects, setFoundSubjects] = useState<Subject[]>([]);
  const [absences, setAbsences] = useState<Absence[]>([]);

  // Define an async function to fetch the list of absences
  const fetchAbsences = async (optionId: number, optionType: OptionType) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_LACKS_URL +
          (optionType === OptionType.Teacher
            ? '/id-teacher/'
            : '/id-subject/') +
          optionId
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
      setAbsences(parsedAbsencesWithoutTeacher); // Update the state with the fetched absences (without the teacher info)
    } catch (error) {
      console.error('Error buscando faltas:', error);
    }
  };

  const searchTeachers = async (searchTerm: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_TEACHERS_URL +
          '/name/' +
          encodeURIComponent(searchTerm)
      );

      if (!response.ok) {
        throw new Error('Fallo la busqueda de docentes.');
      }

      const fetchedTeachers: (User & { password?: string })[] =
        await response.json();
      const teachersWithoutPassword = fetchedTeachers.map(
        ({ password, ...rest }) => ({
          ...rest,
        })
      );
      setFoundTeachers(teachersWithoutPassword);
    } catch (error) {
      console.error('Error leyendo docentes:', error);
    }
  };

  const searchSubjects = async (searchTerm: string) => {
    try {
      const response = await fetch(
        process.env.NEXT_PUBLIC_SUBJECTS_URL +
          '/name/' +
          encodeURIComponent(searchTerm)
      );

      if (!response.ok) {
        throw new Error('Fallo la busqueda de materias.');
      }

      const fetchedSubjects: Subject[] = await response.json();
      setFoundSubjects(fetchedSubjects);
    } catch (error) {
      console.error('Error leyendo materias:', error);
    }
  };

  const searchSubjectsAndTeachers = async (searchTerm: string) => {
    await Promise.all([searchTeachers(searchTerm), searchSubjects(searchTerm)]);
  };

  return (
    <div className={styles['container']}>
      <SearchResultsOptions
        performSearch={searchSubjectsAndTeachers}
        foundTeachers={foundTeachers}
        foundSubjects={foundSubjects}
        selectOption={fetchAbsences}
      />
      <BigCalendar absences={absences} />
    </div>
  );
}

export default ManageAbsences;
