import React from 'react'

interface Product {
  id: number
  name: string
  description: string
  price: number
  imageUrl: string
}

interface CartProps {
  cartItems: Product[]
}

function Cart({ cartItems }: CartProps) {
  return (
    <div>
      <h2>Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name} - ${item.price}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Cart
