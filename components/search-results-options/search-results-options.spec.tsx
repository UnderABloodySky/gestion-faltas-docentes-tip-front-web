import { render } from '@testing-library/react';

import SearchResultsOptions from './search-results-options';

describe('SearchResultsOptions', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<SearchResultsOptions />);
    expect(baseElement).toBeTruthy();
  });
});
