'use client';
// import styles from './page.module.scss';
// import { DatePicker } from "@/components/ui/date-picker"
import AbsenceForm from '@/components/absence-form/absence-form';
import AbsenceCalendar from '@/components/absence-calendar/absence-calendar'


/* eslint-disable-next-line */
export interface AbsenceProps {}

export function Absence(props: AbsenceProps) {
  return (
    <div className="flex flex-col sm:flex-row py-2 justify-around">
      <AbsenceForm />
      <AbsenceCalendar />
    </div>
  );
}

export default Absence;
