import { render } from '@testing-library/react';

import AbsenceCalendar from './absence-calendar';

describe('AbsenceCalendar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AbsenceCalendar />);
    expect(baseElement).toBeTruthy();
  });
});
