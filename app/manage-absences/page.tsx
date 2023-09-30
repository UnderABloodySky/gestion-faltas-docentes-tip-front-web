'use client';

import styles from './page.module.scss';

import { useState } from 'react';

import BigCalendar from '@/components/big-calendar/big-calendar';
import SearchBar from '@/components/search-bar/search-bar';
import { User } from '@/components/auth/auth-context';

/* eslint-disable-next-line */
export interface ManageAbsencesProps {}

export function ManageAbsences(props: ManageAbsencesProps) {
  const [foundTeachers, setFoundTeachers] = useState<User[]>([]);

  const searchTeachers = async (searchTerm: string) => {
    try {
      const response = await fetch(
        'http://localhost:8080/ciriaqui/api/teachers/name/' + searchTerm
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
      console.error('Error leyendo faltas:', error);
    }
  };

  return (
    <div className={styles['container']}>
      <SearchBar performSearch={searchTeachers} foundTeachers={foundTeachers} />
      <BigCalendar />
    </div>
  );
}

export default ManageAbsences;
