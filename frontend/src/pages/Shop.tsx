import React, { useState, useEffect } from 'react';
import { PayPalScriptProvider, PayPalButtons } from '@paypal/react-paypal-js';
import Reviews from '../components/Reviews';
import Zoom from 'react-medium-image-zoom';
import 'react-medium-image-zoom/dist/styles.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
}

const Shop = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Shop</h1>
      <div className="shop-container">
        {products.map((product) => (
          <div key={product.id} className="product-item">
            <Zoom>
              <img src={product.imageUrl} alt={product.name} width="500" />
            </Zoom>
            <h2>{product.name}</h2>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            <p>${product.price}</p>
            <PayPalScriptProvider options={{ 'client-id': 'test' }}>
              <PayPalButtons
                createOrder={(data, actions) => {
                  return actions.order.create({
                    purchase_units: [
                      {
                        amount: {
                          value: product.price.toString(),
                        },
                      },
                    ],
                  });
                }}
                onApprove={(data, actions) => {
                  return actions.order.capture().then((details) => {
                    alert('Transaction completed by ' + details.payer.name.given_name);
                  });
                }}
              />
            </PayPalScriptProvider>
            <Reviews productId={product.id} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Shop;
