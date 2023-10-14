'use client';

import { useCallback, useMemo } from 'react';
import { format, isWithinInterval } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import Absence from '@/app/absence/page';

export type DateRangePickerProps = {
  dateRangeValue: DateRange;
  onChangeRangeDate: (newRangeDate: DateRange | undefined) => void;
  existingAbsences: Absence[];
};

export function DateRangePicker({
  dateRangeValue,
  onChangeRangeDate,
  existingAbsences,
}: DateRangePickerProps) {
  const today = useMemo(() => new Date(), []);

  function isWeekend(date: Date) {
    // Get the day of the week (0 for Sunday, 1 for Monday, ..., 6 for Saturday)
    const dayOfWeek = date.getDay();

    // Check if it's Sunday (0) or Saturday (6)
    return dayOfWeek === 0 || dayOfWeek === 6;
  }

  const isDayDisabled = useCallback(
    (day: Date) => {
      return (
        existingAbsences.some((absence) =>
          isWithinInterval(day, {
            start: absence.beginDate,
            end: absence.endDate,
          })
        ) ||
        day < today ||
        isWeekend(day)
      );
    },
    [existingAbsences, today]
  );

  return (
    <div className={'grid gap-2'}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !dateRangeValue && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateRangeValue?.from ? (
              dateRangeValue.to ? (
                <>
                  {format(dateRangeValue.from, 'LLL dd, y', { locale: es })} -{' '}
                  {format(dateRangeValue.to, 'LLL dd, y', { locale: es })}
                </>
              ) : (
                format(dateRangeValue.from, 'LLL dd, y', { locale: es })
              )
            ) : (
              <span>Seleccione una fecha</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={today}
            fromMonth={today}
            selected={dateRangeValue}
            onSelect={onChangeRangeDate}
            numberOfMonths={2}
            disabled={isDayDisabled}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
