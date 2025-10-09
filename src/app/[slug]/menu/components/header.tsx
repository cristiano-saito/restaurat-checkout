'use client';
import { Restaurant } from '@prisma/client';
import { ChevronLeftIcon, ScrollTextIcon } from 'lucide-react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
interface RestaurantMenuHeaderProps {
  restaurant: Pick<Restaurant, 'coverImageUrl' | 'name'>;
}

import { Button } from '@/components/ui/button';

const RestaurantMenuHeader = ({ restaurant }: RestaurantMenuHeaderProps) => {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };
  const handleOpenOrderPage = () => {
    router.push(`/${slug}/orders`);
  };
  return (
    <div className='relative h-[250px] w-full'>
      <Button
        variant='secondary'
        size='icon'
        className='absolute left-4 top-4 z-50 rounded-full'
        onClick={handleBack}
      >
        <ChevronLeftIcon />
      </Button>
      <Image
        src={restaurant?.coverImageUrl || ''}
        alt={restaurant.name}
        fill
        className='object-cover'
        priority
      />
      <Button
        variant='secondary'
        size='icon'
        className='absolute right-4 top-4 z-50 rounded-full'
        onClick={handleOpenOrderPage}
      >
        <ScrollTextIcon />
      </Button>
    </div>
  );
};

export default RestaurantMenuHeader;
