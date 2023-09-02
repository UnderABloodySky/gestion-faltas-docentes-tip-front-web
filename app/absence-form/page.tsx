import styles from './page.module.scss';

/* eslint-disable-next-line */
export interface AbsenceFormProps {}

export function AbsenceForm(props: AbsenceFormProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to AbsenceForm!</h1>
    </div>
  );
}

export default AbsenceForm;
