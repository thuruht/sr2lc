import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
}

const orders = new Hono<{ Bindings: Bindings }>()

orders.get('/recent', async (c) => {
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM orders ORDER BY createdAt DESC LIMIT 5').all()
  return c.json(results)
})

export default orders
