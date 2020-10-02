import { GetStaticProps } from 'next'

interface IProduct {
  id: string;
  title: string;
}

interface Top10Props {
  products:  IProduct[];
}

export default function Top10({products}: Top10Props){
  async function handleSum() {
    const { sum } = (await import('@/lib/math')).default;

    alert(sum(3, 5))
  }

  return (
    <div>
      <section>
        <h1>Top 10</h1>

          <ul>
            {products.map(product => {
              return (
                <li key={product.id}>
                  {product.title}
                </li>
              );
            })}
          </ul>
      </section>
      <button type="button" onClick={handleSum}>Soma</button>

    </div>
  )
}

export const getStaticProps: GetStaticProps<Top10Props> = async(context) => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
  const products = await response.json();

  return {
    props: {
      products,
    },
    revalidate: 5,
  }
}