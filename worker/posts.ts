import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
}

const posts = new Hono<{ Bindings: Bindings }>()

posts.get('/', async (c) => {
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM posts').all()
  return c.json(results)
})

posts.get('/:id', async (c) => {
  const { id } = c.req.param()
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).all()
  if (results.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json(results[0])
})

posts.post('/', async (c) => {
  const { title, content } = await c.req.json()
  if (!title || !content) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  const { success } = await c.env.SR2LC_DB.prepare('INSERT INTO posts (title, content) VALUES (?, ?)').bind(title, content).run()
  if (success) {
    return c.json({ message: 'Created' }, 201)
  } else {
    return c.json({ error: 'Failed to create' }, 500)
  }
})

posts.put('/:id', async (c) => {
  const { id } = c.req.param()
  const { title, content } = await c.req.json()
  if (!title || !content) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  const { success } = await c.env.SR2LC_DB.prepare('UPDATE posts SET title = ?, content = ? WHERE id = ?').bind(title, content, id).run()
  if (success) {
    return c.json({ message: 'Updated' })
  } else {
    return c.json({ error: 'Failed to update' }, 500)
  }
})

posts.delete('/:id', async (c) => {
  const { id } = c.req.param()
  const { success } = await c.env.SR2LC_DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run()
  if (success) {
    return c.json({ message: 'Deleted' })
  } else {
    return c.json({ error: 'Failed to delete' }, 500)
  }
})

export default posts
