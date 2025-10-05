import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { PatternFormat } from 'react-number-format';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
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

import { isValidCpf, removeCpfPunctuation } from '../helpers/cpf';

interface FinishOrderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const formSchema = z.object({
  name: z.string().trim().min(1, { message: 'Nome é obrigatório' }),
  email: z.string().trim().email({ message: 'Email é obrigatório' }),
  phone: z.string().trim().min(1, { message: 'Telefone é obrigatório' }),
  cpf: z
    .string()
    .trim()
    .min(1, { message: 'CPF é obrigatório' })
    .refine(removeCpfPunctuation, { message: 'CPF inválido' })
    .refine(isValidCpf, { message: 'CPF inválido' }),
});

type FormSchema = z.infer<typeof formSchema>;

const FinishOrderDialog = ({ open, onOpenChange }: FinishOrderDialogProps) => {
  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      cpf: '',
    },
    shouldUnregister: true,
  });

  const onSubmit = (data: FormSchema) => {
    console.log(data);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerTrigger asChild></DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Finalizar pedido</DrawerTitle>
          <DrawerDescription>
            Insira suas informações para finalizar o pedido
          </DrawerDescription>
        </DrawerHeader>
        <div className='space-y-8 p-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
              <FormField
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu nome</FormLabel>
                    <FormControl>
                      <Input placeholder='Digite seu nome' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='email'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu email</FormLabel>
                    <FormControl>
                      <Input placeholder='Digite seu email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='phone'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Seu telefone</FormLabel>
                    <FormControl>
                      <Input placeholder='Digite seu telefone' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name='cpf'
                render={({ field }) => (
                  <FormItem>
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
                <Button className='rounded-full' type='submit'>
                  Finalizar pedido
                </Button>
                <DrawerClose asChild>
                  <Button className='w-full rounded-full' variant='destructive'>
                    Cancelar
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

export default FinishOrderDialog;
