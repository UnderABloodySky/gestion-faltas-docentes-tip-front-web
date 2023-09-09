'use client';
// import styles from './page.module.scss';
import { DatePicker } from "@/components/ui/date-picker"
import { AbsenceForm } from '@/components/absence-form/absence-form';

/* eslint-disable-next-line */
export interface AbsenceProps {}

export function Absence(props: AbsenceProps) {
  return (
    <div className="flex flex-row py-2 justify-evenly">
      <AbsenceForm />
    </div>
    // <div className='flex py-2'>
    //   <div className='flex flex-row'>
    //     <AbsenceForm />
    //   </div>
    // </div>
  );
}

export default Absence;
