import { zodResolver } from '@hookform/resolvers/zod';
import { ConsumptionMethod } from '@prisma/client';
import { loadStripe } from '@stripe/stripe-js';
import { Loader2Icon } from 'lucide-react';
import { useParams, useSearchParams } from 'next/navigation';
import { useContext, useTransition } from 'react';
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

import { createOrder } from '../actions/create-order';
import createStripeCheckout from '../actions/create-stripe-checkout';
import { CartContext } from '../contexts/cart';
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
  const { products } = useContext(CartContext);
  const searchParams = useSearchParams();
  const { slug } = useParams<{ slug: string }>();
  const [isPending] = useTransition();
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

  const onSubmit = async (data: FormSchema) => {
    const consumptionMethod = searchParams.get('consumptionMethod');

    if (!consumptionMethod || !slug) {
      return;
    }

    try {
      const order = await createOrder({
        customerName: data.name,
        customerEmail: data.email,
        customerPhone: data.phone,
        customerCpf: data.cpf,
        products: products,
        restaurantSlug: slug as string,
        consumptionMethod: consumptionMethod as ConsumptionMethod,
      });
      const result = await createStripeCheckout({
        products,
        slug,
        orderId: order.id,
      });
      if (!result) {
        return;
      }
      const { sessionId } = result;

      if (!process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY) {
        throw new Error('NEXT_PUBLIC_STRIPE_PUBLIC_KEY is not set');
      }
      const stripe = await loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
      );

      stripe?.redirectToCheckout({
        sessionId: sessionId as string,
      });
    } catch (error) {
      console.error(error);
    }
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
        <div className='px-5'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
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
                <Button
                  className='rounded-full'
                  type='submit'
                  disabled={isPending}
                >
                  {isPending && (
                    <Loader2Icon className='ml-2 h-4 w-4 animate-spin' />
                  )}
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
