'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { format } from 'date-fns';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { DatePicker } from '@/components/ui/date-picker';
import { useToast } from '@/components/ui/use-toast';
import { Combobox } from '@/components/ui/combobox';

const absenceFormSchema = z.object({
  start_absence_date: z.date({
    required_error: 'Debe seleccionar una fecha.',
  }),
  absence_type: z.string({
    required_error: 'Debe seleccionar un tipo de falta.',
  }),
});

type AbsenceFormValues = z.infer<typeof absenceFormSchema>;

const defaultValues: Partial<AbsenceFormValues> = {
  start_absence_date: new Date(),
};

export function AbsenceForm() {
  const { toast } = useToast();
  const form = useForm<AbsenceFormValues>({
    resolver: zodResolver(absenceFormSchema),
    defaultValues,
  });

  const onSubmit = async (data: AbsenceFormValues) => {
    console.log('data: ', data);
    const parsedData = {
      article: data.absence_type,
      beginDate: format(data.start_absence_date, 'yyyy-MM-dd'),
      idTeacher: 1,
    };
    console.log('parsedData: ', parsedData);
    const stringifiedBody = JSON.stringify(parsedData);
    console.log('stringified body: ', stringifiedBody);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await fetch('http://localhost:8080/lacks', {
      method: 'POST',
      headers: headers,
      body: stringifiedBody,
    });
    console.log('res: ', res);
    console.log('JSON res: ', await res.json());

    if (res.status === 404) {
      toast({
        title: 'Algo salio mal.',
        description: 'Fallo la creacion de la falta.',
      });
    } else if (res.status === 200 || res.status === 201) {
      toast({
        title: 'Creacion exitosa.',
        description: 'Se creo la falta exitosamente.',
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="start_absence_date"
          render={({
            field,
          }: {
            field: { value: Date; onChange: (date: Date | undefined) => void };
          }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha inicial de la falta</FormLabel>
              <DatePicker
                isFormField
                dateValue={field.value}
                onChangeDate={field.onChange}
              />
              <FormDescription>
                Fecha seleccionada como primer día de la falta.
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
                A partir del tipo de falta se determinan la cantidad de dias a
                tomar.
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
