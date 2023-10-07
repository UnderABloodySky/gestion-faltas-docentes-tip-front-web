// import styles from './search-results-options.module.scss';

import { KeyboardEvent, useCallback, useEffect, useState } from 'react';
import { Check } from 'lucide-react';

import { cn } from '@/lib/utils';
import { User } from '@/components/auth/auth-context';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';

export enum OptionType {
  Teacher = 'teacher',
  Subject = 'subject',
}

export enum Cicle {
  Basic = 'BASIC',
  Secundary = 'SECUNDARY',
  Workshop = 'WORKSHOP',
}

export interface Subject {
  id: number;
  name: string;
  cicle: Cicle;
}

/* eslint-disable-next-line */
export interface SearchResultsOptionsProps {
  performSearch: (searchTerm: string) => void;
  foundTeachers?: User[];
  foundSubjects?: Subject[];
  selectOption: (optionId: number, optionType: OptionType) => void;
}

export function SearchResultsOptions({
  performSearch,
  foundTeachers,
  foundSubjects,
  selectOption,
}: SearchResultsOptionsProps) {
  const [searchValue, setSearchValue] = useState<string>('');
  const [debouncedSearchValue, setDebouncedSearchValue] = useState<string>('');
  const [isOptionsListVisible, setIsOptionsListVisible] = useState<boolean>(
    !!searchValue
  );
  const [selectedOptionName, setSelectedOptionName] = useState<string>('');
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);

  console.log('foundTeachers: ', foundTeachers);
  console.log('foundSubjects: ', foundSubjects);

  useEffect(() => {
    // Debounce the search value after 500ms of user inactivity
    const timeoutId = setTimeout(() => {
      if (selectedOptionName !== searchValue) {
        setDebouncedSearchValue(searchValue);
      }
    }, 500);

    // Clear the timeout if the user continues typing within the 500ms
    return () => {
      clearTimeout(timeoutId);
    };
  }, [searchValue, selectedOptionName]);

  useEffect(() => {
    // Perform the search when debouncedSearchValue changes
    if (debouncedSearchValue) {
      performSearch(debouncedSearchValue);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearchValue]);

  const selectTeacher = useCallback(
    (teacherEmail: string) => {
      setIsOptionsListVisible(false);
      const teacher = foundTeachers?.find(
        (teacher) => teacher.email.toLowerCase() === teacherEmail
      );
      const teacherId = teacher?.id || 0;
      const teacherName = teacher?.name || '';
      setSelectedOptionName(teacherName);
      setSearchValue(teacherName);
      selectOption(teacherId, OptionType.Teacher);
    },
    [foundTeachers, selectOption]
  );

  const selectSubject = useCallback(
    (subjectNameLower: string) => {
      console.log('selected subject name: ', subjectNameLower);
      console.log('foundSubjects: ', foundSubjects);

      setIsOptionsListVisible(false);
      const subject = foundSubjects?.find(
        (subject) => subject.name.toLowerCase() === subjectNameLower
      );
      console.log('found subject: ', subject);
      const subjectId = subject?.id || 0;
      const subjectName = subject?.name || '';
      setSelectedOptionName(subjectName);
      setSearchValue(subjectName);
      selectOption(subjectId, OptionType.Subject);
    },
    [foundSubjects, selectOption]
  );

  const handleSearchFocus = useCallback(() => {
    setIsInputFocused(true);
    if (searchValue.length) {
      setIsOptionsListVisible(true);
    }
  }, [searchValue.length]);

  const handleSearchValueChange = (newSearchValue: string) => {
    setIsOptionsListVisible(!!newSearchValue.length);
    setSearchValue(newSearchValue);
  };

  const handleSearchBlur = useCallback(() => {
    setIsInputFocused(false);
    if (!searchValue.length && !!selectedOptionName.length) {
      setSearchValue(selectedOptionName);
    }
  }, [selectedOptionName, searchValue]);

  const handleSearchEnterPress = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        handleSearchBlur();
      }
    },
    [handleSearchBlur]
  );

  return (
    <div className="flex">
      <Command
        className={
          'rounded-lg border my-2' +
          (isInputFocused
            ? ' ring-offset-background outline-none ring-2 ring-ring ring-offset-2'
            : '')
        }
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Busque docentes o materias para filtrar las faltas..."
          value={searchValue}
          onValueChange={handleSearchValueChange}
          onFocus={handleSearchFocus}
          onBlur={handleSearchBlur}
          onKeyUp={handleSearchEnterPress}
        />
        {isOptionsListVisible && (
          <CommandList>
            <CommandEmpty>No se encontraron resultados.</CommandEmpty>
            {!!foundTeachers?.length && (
              <CommandGroup heading="Docentes">
                {foundTeachers.map((teacher) => (
                  <CommandItem
                    key={teacher.id}
                    value={teacher.email}
                    onSelect={selectTeacher}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedOptionName === teacher.name
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <span>{teacher.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
            {!!foundTeachers?.length && !!foundSubjects?.length && (
              <CommandSeparator />
            )}
            {!!foundSubjects?.length && (
              <CommandGroup heading="Materias">
                {foundSubjects.map((subject) => (
                  <CommandItem
                    key={subject.id}
                    value={subject.name}
                    onSelect={selectSubject}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        selectedOptionName === subject.name
                          ? 'opacity-100'
                          : 'opacity-0'
                      )}
                    />
                    <span>{subject.name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        )}
      </Command>
    </div>
  );
}

export default SearchResultsOptions;
