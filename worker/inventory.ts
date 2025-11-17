import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
}

const inventory = new Hono<{ Bindings: Bindings }>()

inventory.get('/low-stock', async (c) => {
  const { results } = await c.env.SR2LC_DB.prepare(`
    SELECT p.name, i.quantity
    FROM inventory i
    JOIN products p ON i.productId = p.id
    WHERE i.quantity < 10
  `).all()
  return c.json(results)
})

export default inventory
