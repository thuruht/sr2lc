import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
}

const comments = new Hono<{ Bindings: Bindings }>()

comments.get('/:postId', async (c) => {
  const { postId } = c.req.param()
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM comments WHERE postId = ?').bind(postId).all()
  return c.json(results)
})

comments.post('/:postId', async (c) => {
  const { postId } = c.req.param()
  const { author, content } = await c.req.json()
  if (!author || !content) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  const { success } = await c.env.SR2LC_DB.prepare('INSERT INTO comments (postId, author, content) VALUES (?, ?, ?)')
    .bind(postId, author, content)
    .run()
  if (success) {
    return c.json({ message: 'Created' }, 201)
  } else {
    return c.json({ error: 'Failed to create' }, 500)
  }
})

export default comments
