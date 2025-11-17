import React, { useState, useEffect } from 'react';

interface Order {
  id: number;
  total: number;
  createdAt: string;
}

interface Inventory {
  name: string;
  quantity: number;
}

const AdminDashboard = () => {
  const [recentSales, setRecentSales] = useState<Order[]>([]);
  const [lowStock, setLowStock] = useState<Inventory[]>([]);

  useEffect(() => {
    fetchRecentSales();
    fetchLowStock();
  }, []);

  const fetchRecentSales = async () => {
    const res = await fetch('/api/orders/recent');
    const data = await res.json();
    setRecentSales(data);
  };

  const fetchLowStock = async () => {
    const res = await fetch('/api/inventory/low-stock');
    const data = await res.json();
    setLowStock(data);
  };

  return (
    <div>
      <h2>Dashboard</h2>
      <div>
        <h3>Recent Sales</h3>
        <ul>
          {recentSales.map((order) => (
            <li key={order.id}>
              ${order.total} - {new Date(order.createdAt).toLocaleDateString()}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3>Low Stock</h3>
        <ul>
          {lowStock.map((item) => (
            <li key={item.name}>
              {item.name} - {item.quantity} remaining
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AdminDashboard;