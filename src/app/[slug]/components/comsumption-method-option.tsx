import { ConsumptionMethod } from '@prisma/client';
import Image from 'next/image';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ComsumptionMethodOptionProps {
  slug: string;
  src: string;
  alt: string;
  buttonText: string;
  option: ConsumptionMethod;
}

const ComsumptionMethodOption = ({
  slug,
  src,
  alt,
  buttonText,
  option,
}: ComsumptionMethodOptionProps) => {
  return (
    <Card>
      <CardContent className='flex flex-col items-center gap-8 py-8'>
        <div className='relative h-[80px] w-[80px]'>
          <Image className='object-contain' src={src} fill alt={alt || ''} />
        </div>
        <Button variant='secondary' className='rounded-full' asChild>
          <Link href={`/${slug}/menu?consumptionMethod=${option}`}>
            {buttonText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default ComsumptionMethodOption;
