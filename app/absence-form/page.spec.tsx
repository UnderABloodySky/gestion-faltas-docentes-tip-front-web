import { render } from '@testing-library/react';

import AbsenceForm from './page';

describe('AbsenceForm', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<AbsenceForm />);
    expect(baseElement).toBeTruthy();
  });
});
