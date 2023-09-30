import { render } from '@testing-library/react';

import BigCalendar from './big-calendar';

describe('BigCalendar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<BigCalendar />);
    expect(baseElement).toBeTruthy();
  });
});
