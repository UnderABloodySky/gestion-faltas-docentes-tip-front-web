'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';
import { DateRange } from 'react-day-picker';

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

export function AbsenceForm() {
  const { toast } = useToast();
  const { user } = useAuth();
  const form = useForm<AbsenceFormValues>({
    resolver: zodResolver(absenceFormSchema),
  });

  const onSubmit = async (data: AbsenceFormValues) => {
    console.log('data: ', data);
    const parsedData = {
      article: data.absence_type,
      beginDate: format(data.absence_date_range.from, 'yyyy-MM-dd'),
      endDate: format(
        data.absence_date_range.to || data.absence_date_range.from,
        'yyyy-MM-dd'
      ),
      idTeacher: user?.id,
    };
    console.log('parsedData: ', parsedData);
    const stringifiedBody = JSON.stringify(parsedData);
    console.log('stringified body: ', stringifiedBody);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await fetch('http://localhost:8080/ciriaqui/api/lacks', {
      method: 'POST',
      headers: headers,
      body: stringifiedBody,
    });
    console.log('res: ', res);
    // console.log('JSON res: ', await res.json());

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
    } else if (res.status === 200 || res.status === 201) {
      const { id } = await res.json();
      toast({
        title: 'Creacion exitosa.',
        description: `Se creo la falta con id ${id} exitosamente.`,
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
                onChangeTypeValue={(newTypeValue) =>
                  form.setValue('absence_type', newTypeValue)
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
        <Button type="submit">Crear falta</Button>
      </form>
    </Form>
  );
}

export default AbsenceForm;
