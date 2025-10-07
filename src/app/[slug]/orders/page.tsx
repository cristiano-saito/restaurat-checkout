import { getOrders } from '../menu/actions/get-orders';
import { isValidCpf, removeCpfPunctuation } from '../menu/helpers/cpf';
import CpfForm from './components/cpf-form';
import OrdersList from './components/orders-list';
interface OrdersPageProps {
  searchParams: Promise<{ cpf: string }>;
}

const OrdersPage = async ({ searchParams }: OrdersPageProps) => {
  const { cpf } = await searchParams;
  if (!cpf || !isValidCpf(cpf)) {
    return <CpfForm />;
  }
  const orders = await getOrders(removeCpfPunctuation(cpf));

  return <OrdersList orders={orders} />;
};

export default OrdersPage;
