import { useRouter } from 'next/router'
import { useState } from 'react';
import dynamic from 'next/dynamic'
import { GetStaticPaths, GetStaticProps } from 'next';
import Prismic from 'prismic-javascript';
import Link from 'next/link';
import PrismicDom from 'prismic-dom';
import { client } from '@/lib/prismic';
import { Document } from 'prismic-javascript/types/documents'

interface ProductProps {
  product: Document;
}

const AddToCartModal = dynamic(() => import('@/components/AddToCartModal'), 
  { loading: () => <p>Loading...</p>, ssr: false} 
);

export default function Products({product}: ProductProps) {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAdToCartModalVisible] = useState(false)

  if(router.isFallback){
    return <p>Carregando...</p>
  }

  function handleAddToCart() {
    setIsAdToCartModalVisible(true)
  }

  return (
    <div>
      <h1>{PrismicDom.RichText.asText(product.data.title)}</h1>
      <br/>

      <img src={product.data.thumbnail.url} width={200} alt={product.data.title}/>
      <br/><br/>

      <div dangerouslySetInnerHTML={{__html: PrismicDom.RichText.asHtml(product.data.description)}}>
      </div>
      <br/>
      <p>Price: ${product.data.price}</p>
      <br/><br/>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}

      <h6>{router.query.slug}</h6>

    </div>
  )
}



export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: true,
  }
}


export const getStaticProps: GetStaticProps<ProductProps> = async(context) => {
  const { slug } = context.params;
  
  const product = await client().getByUID('product', String(slug), {});
  
  return {
    props: {
      product,
    },
    revalidate: 6,
  }
}