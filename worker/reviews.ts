import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
}

const reviews = new Hono<{ Bindings: Bindings }>()

reviews.get('/:productId', async (c) => {
  const { productId } = c.req.param()
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM reviews WHERE productId = ?').bind(productId).all()
  return c.json(results)
})

reviews.post('/:productId', async (c) => {
  const { productId } = c.req.param()
  const { author, rating, content } = await c.req.json()
  if (!author || !rating || !content) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  const { success } = await c.env.SR2LC_DB.prepare('INSERT INTO reviews (productId, author, rating, content) VALUES (?, ?, ?, ?)')
    .bind(productId, author, rating, content)
    .run()
  if (success) {
    return c.json({ message: 'Created' }, 201)
  } else {
    return c.json({ error: 'Failed to create' }, 500)
  }
})

export default reviews
