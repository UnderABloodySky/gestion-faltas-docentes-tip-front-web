import { render } from '@testing-library/react';

import CiriaquiNavMenu from './ciriaqui-nav-menu';

describe('CiriaquiNavMenu', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<CiriaquiNavMenu />);
    expect(baseElement).toBeTruthy();
  });
});
