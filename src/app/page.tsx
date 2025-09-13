import Link from 'next/link';
import type { Product } from '@/types/product';
import {
  wordBreaker,
  numberFormat,
  getDiscount,
} from '../utils/textFormatters';
import CardProduct from '@/components/productCard';
import { notFound } from 'next/navigation';
import { getProductsLimited } from '@/services/products';
import Image from 'next/image';
export default async function Home() {
  //Cargar productos
  const products: Product[] = await getProductsLimited(15);
  if (products.length === 0) notFound();
  const productURL = (id: string, name: string) =>
    `${id}:${name.replaceAll(' ', '-')}`;
  return (
    <>
      <section className='grid mt-8  gap-9  grid-cols-1 md:grid-cols-2 lg:grid-rows-2 lg:grid-cols-4'>
        <Link
          href={`/products/${productURL(products[0].id, products[0].name)}`}
          className='md:col-span-2 lg:row-span-2'
        >
          <article className=' p-4 bg-white border-1 border-gray shadow-xl rounded-2xl h-full group hover:shadow-2xl transition duration-300 ease-in-ou'>
            <p className='text-3xl text-center uppercase'>
              <strong>{products[0].name}</strong>
            </p>
            <div className='overflow-hidden'>
              <Image
                src={products[0].image}
                alt={products[0].name}
                width='250'
                height='250'
                className='object-contain mx-auto blur-[0.4px] group-hover:scale-110 group-hover:contrast-125 group-hover:blur-none'
              />
            </div>
            <div className='px-5 space-y-4'>
              <div className='flex gap-8 items-center justify-center'>
                <p className='font-medium text-2xl font-(family-name:--font-barlow)'>
                  {numberFormat(
                    getDiscount(products[0].price, products[0].discount)
                  )}
                </p>
                {products[0].discount > 0 && (
                  <div className='bg-p-red text-white font-semibold inline-block py-1 px-2 rounded-sm  h-max'>{`-${products[0].discount}%`}</div>
                )}
              </div>
              <p> {`${wordBreaker(products[0].description, 35)}...`}</p>
            </div>
          </article>
        </Link>
        {products.slice(1, 3).map((product) => (
          <Link
            href={`/products/${productURL(product.id, product.name)}`}
            key={product.id}
            className='lg:col-span-2'
          >
            <article className='px-8 py-5 bg-white border-1 border-gray shadow-xl rounded-2xl relative grid grid-cols-1 lg:grid-cols-3 gap-4 h-full group hover:shadow-2xl transition duration-300 ease-in-out'>
              <div className='row-span-3 self-center overflow-hidden'>
                <Image
                  src={product.image}
                  alt={product.name}
                  width='200'
                  height='200'
                  className='mx-auto  object-contain blur-[0.4px] group-hover:scale-110 group-hover:contrast-125 group-hover:blur-none'
                />
              </div>
              <p className='col-span-2 lg:w-[80%] text-center lg:text-left order-first md:order-none uppercase'>
                <strong className='text-2xl'>{product.name}</strong>
              </p>
              <div className='col-span-2 text-center lg:text-left font-(family-name:--font-barlow) space-x-2'>
                <strong className='text-xl'>
                  {numberFormat(getDiscount(product.price, product.discount))}
                </strong>{' '}
                <small>
                  <s>{numberFormat(product.price)}</s>
                </small>
              </div>
              {product.discount > 0 && (
                <span className='bg-p-red text-white font-semibold inline-block py-1 px-2 rounded-sm h-max absolute top-4 right-4'>{`-${product.discount}%`}</span>
              )}
              <p className='col-span-2 order-last lg:order-none'>
                {wordBreaker(product.description, 20)}
              </p>
            </article>
          </Link>
        ))}
      </section>
      <section>
        <h2 className='my-8 text-3xl font-bold text-dark-blue'>
          M&aacute;s productos
        </h2>
        <div className='grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))]  gap-5'>
          {products.slice(3).map((product) => (
            <Link
              key={product.id}
              href={`/products/${productURL(product.id, product.name)}`}
            >
              <CardProduct data={product} />
            </Link>
          ))}
        </div>
        <div className='flex justify-center self-center'>
          <Link
            href='/products/'
            className='my-8 bg-green text-white px-4 py-2 rounded-md inline-block font-bold hover:scale-105 hover:bg-dark-green transition duration-300 ease-in-out'
          >
            Ver m&aacute;s productos
          </Link>
        </div>
      </section>
    </>
  );
}
