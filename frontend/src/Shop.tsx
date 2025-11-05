import React, { useEffect, useState } from 'react'
import Cart from './Cart'
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js'

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}

function Shop() {
  const [products, setProducts] = useState<Product[]>([])
  const [cartItems, setCartItems] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
  }, [])

  const addToCart = (product: Product) => {
    setCartItems([...cartItems, product])
  }

  const createOrder = (data, actions) => {
    const total = cartItems.reduce((acc, item) => acc + item.price, 0)
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            value: total,
          },
        },
      ],
    })
  }

  const onApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      alert('Transaction completed by ' + details.payer.name.given_name)
      setCartItems([])
    })
  }

  return (
    <PayPalScriptProvider options={{ 'client-id': 'test' }}>
      <div>
        <h1>Shop</h1>
        <Cart cartItems={cartItems} />
        <div>
          {products.map((product) => (
            <div key={product.id}>
              <img src={product.imageUrl} alt={product.name} />
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <p>${product.price}</p>
              <button onClick={() => addToCart(product)}>Add to Cart</button>
            </div>
          ))}
        </div>
        {cartItems.length > 0 && (
          <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
        )}
      </div>
    </PayPalScriptProvider>
  )
}

export default Shop