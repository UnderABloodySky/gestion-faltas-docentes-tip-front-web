import styles from './absence-detail.module.scss';

/* eslint-disable-next-line */
export interface AbsenceDetailProps {}

export function AbsenceDetail(props: AbsenceDetailProps) {
  return (
    <div className={styles['container']}>
      <h1>Welcome to AbsenceDetail!</h1>
    </div>
  );
}

export default AbsenceDetail;
