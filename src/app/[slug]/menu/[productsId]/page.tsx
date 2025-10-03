import { notFound } from 'next/navigation';

import { db } from '@/lib/prisma';

import ProductDetails from './components/product-details';
import ProductHeader from './components/product-header';

interface ProductPageProps {
  params: Promise<{
    slug: string;
    productId: string;
  }>;
}
const ProductPage = async ({ params }: ProductPageProps) => {
  const { slug, productId } = await params;

  const product = await db.product.findFirst({
    where: {
      id: productId,
    },
    include: {
      restaurant: {
        select: {
          name: true,
          avatarImageUrl: true,
          slug: true,
        },
      },
    },
  });

  if (!product) {
    return notFound();
  }

  if (product.restaurant.slug.toLowerCase() !== slug.toLowerCase()) {
    return notFound();
  }

  return (
    <div>
      <ProductHeader product={product} />
      <ProductDetails product={product} />
    </div>
  );
};

export default ProductPage;
