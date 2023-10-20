import { render } from '@testing-library/react';

import CiriaquiNavBar from './ciriaqui-nav-bar';

describe('CiriaquiNavBar', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CiriaquiNavBar />);
    expect(baseElement).toBeTruthy();
  });
});
