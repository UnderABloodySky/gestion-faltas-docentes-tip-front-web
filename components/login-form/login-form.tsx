'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { useAuth, User } from '@/components/auth/auth-context';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const formSchema = z.object({
  email: z
    .string()
    .min(1, {
      message: 'Debe completar el campo de email',
    })
    .email('Email invalido'),
  password: z
    .string()
    .min(4, { message: 'La contraseña debe tener al menos 4 caracteres' }),
});

export function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const { login } = useAuth();
  const router = useRouter();

  const handleLoginSuccess = (userData: User) => {
    login(userData);
    // Redirect to login success route
    router.push('/absence');
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const stringifiedBody = JSON.stringify(values);
    console.log('stringified body: ', stringifiedBody);

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');

    const res = await fetch('' + process.env.NEXT_PUBLIC_LOGIN_URL, {
      method: 'POST',
      headers: headers,
      body: stringifiedBody,
    });

    console.log('res: ', res);
    if (res.status === 400) {
      console.log('fallo el login');
    } else if (res.status === 200) {
      const userData = await res.json();
      console.log('JSON userData: ', userData);
      const parsedUser: User = {
        id: userData.id,
        name: userData.name,
        email: userData.email,
      };
      console.log('login exitoso');
      handleLoginSuccess(parsedUser);
    } else {
      console.log('error desconocido');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="tu.email@ejemplo.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" placeholder="******" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Loguear</Button>
      </form>
    </Form>
  );
}

export default LoginForm;
