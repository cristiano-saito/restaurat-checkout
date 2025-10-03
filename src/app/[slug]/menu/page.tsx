import { ConsumptionMethod } from '@prisma/client';
import { notFound } from 'next/navigation';

import { getRestaurantBySlug } from '@/app/data/get-restaurant-by-slug';

import RestaurantMenuCategories from './components/categories';
import RestaurantMenuHeader from './components/header';
interface MenuPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{
    consumptionMethod: ConsumptionMethod;
  }>;
}

const isConsumptionMethodValid = (consumptionMethod: ConsumptionMethod) => {
  return (
    consumptionMethod === ConsumptionMethod.DINE_IN ||
    consumptionMethod === ConsumptionMethod.TAKEAWAY
  );
};

const MenuPage = async ({ params, searchParams }: MenuPageProps) => {
  const { slug } = await params;
  const { consumptionMethod } = await searchParams;
  if (!isConsumptionMethodValid(consumptionMethod)) {
    return notFound();
  }
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) {
    return notFound();
  }
  return (
    <div>
      <RestaurantMenuHeader restaurant={restaurant} />
      <RestaurantMenuCategories restaurant={restaurant} />
    </div>
  );
};

export default MenuPage;
