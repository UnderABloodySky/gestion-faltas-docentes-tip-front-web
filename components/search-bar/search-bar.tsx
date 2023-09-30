'use client';

// import styles from './search-bar.module.scss';
import { useEffect, useState, ChangeEvent } from 'react';

import { Input } from '@/components/ui/input';
import { User } from '@/components/auth/auth-context';

/* eslint-disable-next-line */
export interface SearchBarProps {
  performSearch: (searchTerm: string) => void,
  foundTeachers?: User[],
}

export default function SearchBar({
  performSearch,
  foundTeachers,
}: SearchBarProps) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');

  useEffect(() => {
    // Debounce the search value after 500ms of user inactivity
    const timeoutId = setTimeout(() => {
      setDebouncedSearchValue(searchValue);
    }, 500);

    // Clear the timeout if the user continues typing within the 500ms
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue]);

  useEffect(() => {
    // Perform the search when debouncedSearchValue changes
    if (debouncedSearchValue) {
      performSearch(debouncedSearchValue);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);


  // Handle changes to the search input
  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    setSearchValue(value);
  };

  return (
    <div className='flex'>
      <Input
        type="search"
        placeholder="Busca docentes para filtrar las faltas..."
        className="flex mt-2 lg:w-1/3"
        value={searchValue}
        onChange={handleSearchChange}
      />
    </div>
  );
}
