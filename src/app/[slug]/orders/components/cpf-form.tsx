'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { usePathname, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
} from '@/components/ui/drawer';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { isValidCpf, removeCpfPunctuation } from '../../menu/helpers/cpf';

const CpfForm = () => {
  const formSchema = z.object({
    cpf: z
      .string()
      .trim()
      .min(1, { message: 'CPF é obrigatório' })
      .refine(removeCpfPunctuation, { message: 'CPF inválido' })
      .refine(isValidCpf, { message: 'CPF inválido' }),
  });

  type FormSchema = z.infer<typeof formSchema>;
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
  });
  const router = useRouter();
  const pathname = usePathname();

  const onSubmit = async (data: FormSchema) => {
    router.push(`${pathname}?cpf=${removeCpfPunctuation(data.cpf)}`);
  };
  const onCancel = () => {
    router.back();
  };
  return (
    <Drawer open={true}>
      <DrawerContent>
        <div className='space-y-2 p-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='cpf'
                render={({ field }) => (
                  <FormItem className='px-4'>
                    <FormLabel>Seu CPF</FormLabel>
                    <FormControl>
                      <PatternFormat
                        placeholder='Digite seu CPF'
                        format='###.###.###-##'
                        customInput={Input}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DrawerFooter>
                <Button type='submit' className='w-full rounded-full'>
                  Submit
                </Button>
                <DrawerClose>
                  <Button
                    variant='destructive'
                    className='w-full rounded-full'
                    onClick={onCancel}
                  >
                    Cancel
                  </Button>
                </DrawerClose>
              </DrawerFooter>
            </form>
          </Form>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default CpfForm;
