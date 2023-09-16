import { render } from '@testing-library/react';

import AbsenceDetail from './absence-detail';

describe('AbsenceDetail', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AbsenceDetail />);
    expect(baseElement).toBeTruthy();
  });
});
