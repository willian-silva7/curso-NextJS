import { useRouter } from 'next/router'
import { useState } from 'react';
import dynamic from 'next/dynamic'

const AddToCartModal = dynamic(() => import('@/components/AddToCartModal'), 
  { loading: () => <p>Loading...</p>, ssr: false} 
);

export default function Products() {
  const router = useRouter();
  const [isAddToCartModalVisible, setIsAdToCartModalVisible] = useState(false)

  function handleAddToCart() {
    setIsAdToCartModalVisible(true)
  }

  return (
    <div>
      <h1>{router.query.slug}</h1>

      <button onClick={handleAddToCart}>Add to cart</button>

      {isAddToCartModalVisible && <AddToCartModal />}
    </div>
  )
}