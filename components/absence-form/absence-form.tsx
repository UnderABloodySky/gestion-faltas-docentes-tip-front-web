'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { ResolverOptions, useForm } from 'react-hook-form';
import * as z from 'zod';
import { format, isWithinInterval } from 'date-fns';
import { DateRange } from 'react-day-picker';
import { PenSquare, Trash2 } from 'lucide-react';

import { useAuth } from '@/components/auth/auth-context';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { ToastAction } from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import { Combobox } from '@/components/ui/combobox';
import { Absence } from 'app/absence/page';

export type AbsenceType = {
  value: string;
  label: string;
};

export const absence_types: AbsenceType[] = [
  {
    value: 'EXAM',
    label: 'Examen',
  },
  {
    value: 'MAJORFORCE',
    label: 'Fuerza mayor',
  },
  {
    value: 'PARTICULAR',
    label: 'Particular',
  },
  {
    value: 'MOVING',
    label: 'Mudanza',
  },
  {
    value: 'EXCEPTIONALPERMISSIONS',
    label: 'Permiso excepcional',
  },
  {
    value: 'TAKECAREFAMILY',
    label: 'Cuidado de un familiar',
  },
  {
    value: 'DISABLEDCHILD',
    label: 'Hijo discapacitado',
  },
  {
    value: 'MATERNITY',
    label: 'Maternidad',
  },
  {
    value: 'STUDYDAY',
    label: 'Dia de estudio',
  },
  {
    value: 'CONTEST',
    label: 'Concurso',
  },
];

const doDateRangesOverlap = (
  range1Start: Date,
  range1End: Date,
  range2Start: Date,
  range2End: Date
) => {
  const dateRange1 = { start: range1Start, end: range1End };
  const dateRange2 = { start: range2Start, end: range2End };

  return (
    isWithinInterval(dateRange1.start, dateRange2) ||
    isWithinInterval(dateRange2.start, dateRange1)
  );
};

const absenceFormSchema = z.object({
  absence_date_range: z.object(
    {
      from: z.date(),
      to: z.date().optional(),
    },
    { required_error: 'Debe seleccionar una fecha.' }
  ),
  absence_type: z.string({
    required_error: 'Debe seleccionar un tipo de falta.',
  }),
});

type AbsenceFormValues = z.infer<typeof absenceFormSchema>;

export interface AbsenceFormProps {
  selectedAbsence?: Absence;
  onUpdateAbsenceSuccess: () => void;
  existingAbsences: Absence[];
}

export function AbsenceForm({
  selectedAbsence,
  onUpdateAbsenceSuccess,
  existingAbsences,
}: AbsenceFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();

  const customResolver = async (
    data: AbsenceFormValues,
    context: unknown,
    options: ResolverOptions<AbsenceFormValues>
  ) => {
    let extraErrors = {};
    if (data.absence_date_range?.from && data.absence_date_range?.to) {
      handleSelectRangeDate(data.absence_date_range);
      extraErrors = form.formState.errors;
    }
    const resolved = await zodResolver(absenceFormSchema)(
      data,
      context,
      options
    );
    return { ...resolved, errors: { ...resolved.errors, ...extraErrors } };
  };

  const form = useForm<AbsenceFormValues>({
    mode: 'onBlur',
    resolver: customResolver,
  });

  useEffect(() => {
    if (selectedAbsence) {
      form.clearErrors();
      form.setValue('absence_type', selectedAbsence.article);
      form.setValue('absence_date_range', {
        from: selectedAbsence.beginDate,
        to: selectedAbsence.endDate,
      });
    } else {
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAbsence]);

  const onSubmit = async (data: AbsenceFormValues) => {
    const parsedData = {
      article: data.absence_type,
      beginDate: format(data.absence_date_range.from, 'yyyy-MM-dd'),
      endDate: format(
        data.absence_date_range.to || data.absence_date_range.from,
        'yyyy-MM-dd'
      ),
      idTeacher: user?.id,
    };
    const stringifiedBody = JSON.stringify(parsedData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await fetch('' + process.env.NEXT_PUBLIC_LACKS_URL, {
      method: 'POST',
      headers: headers,
      body: stringifiedBody,
    });

    if (res.status === 404 || res.status === 400) {
      toast({
        variant: 'destructive',
        title: 'Algo salio mal.',
        description: 'Fallo la creacion de la falta.',
        action: (
          <ToastAction
            altText="Reintentar"
            onClick={() => {
              onSubmit(data);
            }}
          >
            Reintentar
          </ToastAction>
        ),
      });
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Fecha invalida.',
        description: 'Existe otra falta dentro del rango de la nueva falta.',
      });
    } else if (res.status === 200 || res.status === 201) {
      onUpdateAbsenceSuccess();
      toast({
        title: 'Creacion exitosa.',
        description: `Se creo la falta exitosamente.`,
      });
    }
  };

  const onUpdate = async () => {
    const data = form.getValues();
    const parsedData = {
      article: data.absence_type,
      beginDate: format(data.absence_date_range.from, 'yyyy-MM-dd'),
      endDate: format(
        data.absence_date_range.to || data.absence_date_range.from,
        'yyyy-MM-dd'
      ),
      idTeacher: user?.id,
      id: selectedAbsence?.id,
    };
    const stringifiedBody = JSON.stringify(parsedData);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await fetch('' + process.env.NEXT_PUBLIC_LACKS_URL, {
      method: 'PUT',
      headers: headers,
      body: stringifiedBody,
    });

    if (res.status === 404 || res.status === 400 || res.status === 500) {
      toast({
        variant: 'destructive',
        title: 'Algo salio mal.',
        description: 'Fallo la actualizacion de la falta.',
        action: (
          <ToastAction altText="Reintentar" onClick={onUpdate}>
            Reintentar
          </ToastAction>
        ),
      });
    } else if (res.status === 409) {
      toast({
        variant: 'destructive',
        title: 'Fecha invalida.',
        description:
          'Existe otra falta dentro del rango de la falta actualizada.',
      });
    } else if (res.status === 200) {
      onUpdateAbsenceSuccess();
      toast({
        title: 'Actualizacion exitosa.',
        description: `Se actualizo la falta exitosamente.`,
      });
    }
  };

  const onDelete = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_LACKS_URL}/id/${selectedAbsence?.id}`,
      {
        method: 'DELETE',
      }
    );

    if (res.status === 404 || res.status === 400 || res.status === 500) {
      toast({
        variant: 'destructive',
        title: 'Algo salio mal.',
        description: 'Fallo el borrado de la falta.',
        action: (
          <ToastAction altText="Reintentar" onClick={onDelete}>
            Reintentar
          </ToastAction>
        ),
      });
    } else if (res.status === 200) {
      onUpdateAbsenceSuccess();
      toast({
        title: 'Borrado exitoso.',
        description: `Se borro la falta exitosamente.`,
      });
    }
  };

  const handleSelectRangeDate = (
    newRangeDate: DateRange | undefined,
    updateFormField?: (newRange: DateRange | undefined) => void
  ) => {
    let shouldShowErrorConflictDays = false;
    if (newRangeDate?.from && newRangeDate?.to) {
      shouldShowErrorConflictDays = existingAbsences.some((absence) =>
        doDateRangesOverlap(
          newRangeDate.from as Date,
          newRangeDate.to as Date,
          absence.beginDate,
          absence.endDate
        )
      );
    }

    if (shouldShowErrorConflictDays) {
      form.setError('absence_date_range', {
        type: 'custom',
        message:
          'Rango de fechas invalido - superposicion con faltas existentes.',
      });
    } else {
      form.clearErrors('absence_date_range');
    }

    if (updateFormField) {
      updateFormField(newRangeDate);
    }
  };

  const handleSelectTypeValue = (
    newTypeValue: string,
    updateFormField: (newValue: string) => void
  ) => {
    form.clearErrors('absence_type');
    updateFormField(newTypeValue);
  };

  const formHasErrors =
    form.formState.errors && Object.keys(form.formState.errors).length > 0;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="absence_date_range"
          render={({
            field,
          }: {
            field: {
              value: DateRange;
              onChange: (newRange: DateRange | undefined) => void;
            };
          }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fechas de la falta</FormLabel>
              <DateRangePicker
                existingAbsences={existingAbsences}
                dateRangeValue={field.value}
                onChangeRangeDate={(newRangeDate) =>
                  handleSelectRangeDate(newRangeDate, field.onChange)
                }
              />
              <FormDescription>
                Fechas seleccionadas para faltar.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="absence_type"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Tipo de falta</FormLabel>
              <Combobox
                typeValue={field.value}
                onChangeTypeValue={(newTypeValue) =>
                  handleSelectTypeValue(newTypeValue, field.onChange)
                }
              />
              <FormDescription>
                El tipo de falta determina la cantidad de dias minimos y
                maximos.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {selectedAbsence ? (
          <div className="flex flex-row gap-5">
            <Button type="button" onClick={onUpdate} disabled={!!formHasErrors}>
              <PenSquare className="mr-2 h-4 w-4 shrink-0" /> Actualizar falta
            </Button>
            <Button type="button" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4 shrink-0" /> Borrar falta
            </Button>
          </div>
        ) : (
          <Button type="submit" disabled={!!formHasErrors}>
            Crear falta
          </Button>
        )}
      </form>
    </Form>
  );
}

export default AbsenceForm;
