'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
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
}

export function AbsenceForm({
  selectedAbsence,
  onUpdateAbsenceSuccess,
}: AbsenceFormProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<AbsenceFormValues>({
    resolver: zodResolver(absenceFormSchema),
  });

  useEffect(() => {
    if (selectedAbsence) {
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
              onChange: (date: DateRange | undefined) => void;
            };
          }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fechas de la falta</FormLabel>
              <DateRangePicker
                dateRangeValue={field.value}
                onChangeRangeDate={field.onChange}
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
                onChangeTypeValue={field.onChange}
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
            <Button type="button" onClick={onUpdate}>
              <PenSquare className="mr-2 h-4 w-4 shrink-0" /> Actualizar falta
            </Button>
            <Button type="button" onClick={onDelete}>
              <Trash2 className="mr-2 h-4 w-4 shrink-0" /> Borrar falta
            </Button>
          </div>
        ) : (
          <Button type="submit">Crear falta</Button>
        )}
      </form>
    </Form>
  );
}

export default AbsenceForm;
