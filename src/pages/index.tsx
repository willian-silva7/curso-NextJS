import { GetServerSideProps } from 'next';
import { Title } from '@/styles/pages/Home';
import SEO from '@/components/SEO';

interface IProduct {
  id: string;
  title: string;
}

interface HomeProps {
  recommendedProducts: IProduct[];
}

export default function Home({ recommendedProducts}: HomeProps) {
  async function handleSum() {
    const { sum } = (await import('@/lib/math')).default;

    alert(sum(3, 5))
  }

  return (
    <div>
      <SEO 
        title="DevCommerce, o seu, o meu, o nosso e-commerce de Respeito" 
        image="background.png"
        shouldExcludeTitleSuffix
        />

      <section>
        <Title>Products</Title>

          <ul>
            {recommendedProducts.map(recommendedProduct => {
              return (
                <li key={recommendedProduct.id}>
                  {recommendedProduct.title}
                </li>
              );
            })}
          </ul>

          <button type="button" onClick={handleSum}>Soma</button>
      </section>
    </div>
  )
}


export const getServerSideProps: GetServerSideProps<HomeProps> = async () => {
  const response = await fetch(`http://localhost:3333/recommended`);
  const recommendedProducts = await response.json();

  return {
    props: {
      recommendedProducts
    }
  }
}
