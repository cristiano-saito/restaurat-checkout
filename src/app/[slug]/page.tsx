import { ConsumptionMethod } from '@prisma/client';
import Image from 'next/image';
import { notFound } from 'next/navigation';

import { getRestaurantBySlug } from '@/app/data/get-restaurant-by-slug';

import ComsumptionMethodOption from './components/comsumption-method-option';

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);
  if (!restaurant) {
    return notFound();
  }
  return (
    <div className='justify-content flex h-screen flex-col items-center px-6 pt-24'>
      <div className='flex flex-col items-center gap-2'>
        <Image
          src={restaurant?.avatarImageUrl || ''}
          alt={restaurant?.name || ''}
          width={82}
          height={82}
        />
        <h2 className='font-semibold'>{restaurant?.name}</h2>
      </div>
      <div className='space-y-2 pt-24 text-center'>
        <h2 className='text-2xl font-semibold'>Seja bem vindo(a)!</h2>
        <p className='text-sm text-gray-500'>
          Escolha como quer aproveitar nossos lanches! Oferecemos praticidade e
          sabores incríveis!
        </p>
      </div>
      <div className='grid grid-cols-2 gap-4 pt-14'>
        <ComsumptionMethodOption
          src={'/hamb.png'}
          alt={restaurant?.name || ''}
          buttonText='Comer Aqui'
          option={ConsumptionMethod.DINE_IN}
          slug={slug}
        />
        <ComsumptionMethodOption
          src={'/packet.png'}
          alt={restaurant?.name || ''}
          buttonText='Para Levar'
          option={ConsumptionMethod.DINE_IN}
          slug={slug}
        />
      </div>
    </div>
  );
};

export default RestaurantPage;
