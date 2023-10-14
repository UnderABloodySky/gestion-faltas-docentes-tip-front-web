'use client';

import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FormControl } from './form';
import { absence_types } from '@/components/absence-form/absence-form';

export type ComboboxProps = {
  typeValue: string;
  onChangeTypeValue: (newTypeValue: string) => void;
};

export function Combobox({ typeValue, onChangeTypeValue }: ComboboxProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              'w-[200px] justify-between',
              !typeValue && 'text-muted-foreground'
            )}
          >
            {typeValue
              ? absence_types.find(
                  (absence_type) => absence_type.value === typeValue
                )?.label
              : 'Elija el tipo de falta'}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Buscar tipo de falta..." />
          <CommandEmpty>No se encontro el tipo de falta.</CommandEmpty>
          <CommandGroup>
            {absence_types.map((absence_type) => (
              <CommandItem
                value={absence_type.label}
                key={absence_type.value}
                onSelect={() => {
                  onChangeTypeValue(absence_type.value);
                }}
              >
                <Check
                  className={cn(
                    'mr-2 h-4 w-4',
                    typeValue === absence_type.value
                      ? 'opacity-100'
                      : 'opacity-0'
                  )}
                />
                {absence_type.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default Combobox;
