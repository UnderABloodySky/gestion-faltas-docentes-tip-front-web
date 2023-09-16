'use client';

import * as React from 'react';
import { format } from 'date-fns';
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

export type DateRangePickerProps = {
  dateRangeValue: DateRange;
  onChangeRangeDate: (newRangeDate: DateRange | undefined) => void;
};

export function DateRangePicker({
  dateRangeValue,
  onChangeRangeDate,
}: DateRangePickerProps) {
  const today = new Date();
  const disabledDays = [
    {
      before: today,
    },
    {
      dayOfWeek: [0, 6],
    },
  ];

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
            disabled={disabledDays}
            showOutsideDays={false}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
