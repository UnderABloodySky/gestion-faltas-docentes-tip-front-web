'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FormControl } from '@/components/ui/form';

export type DatePickerProps = {
  isFormField?: boolean;
  dateValue: Date;
  onChangeDate: (newDate: Date | undefined) => void;
};

export function DatePicker({
  isFormField = false,
  dateValue,
  onChangeDate,
}: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        {isFormField ? (
          <FormControl>
            <Button
              variant={'outline'}
              className={cn(
                'w-[240px] pl-3 text-left font-normal',
                !dateValue && 'text-muted-foreground'
              )}
            >
              {dateValue ? (
                format(dateValue, 'PPP', { locale: es })
              ) : (
                <span>Selecciona una fecha</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        ) : (
          <Button
            variant={'outline'}
            className={cn(
              'w-[280px] justify-start text-left font-normal',
              !dateValue && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {dateValue ? (
              format(dateValue, 'PPP', { locale: es })
            ) : (
              <span>Selecciona una fecha</span>
            )}
          </Button>
        )}
      </PopoverTrigger>
      <PopoverContent
        className="w-auto p-0"
        align={isFormField ? 'start' : 'center'}
      >
        <Calendar
          mode="single"
          selected={dateValue}
          onSelect={onChangeDate}
          disabled={(date) => date < new Date('1900-01-01')}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
