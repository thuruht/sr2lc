import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
}

const bio = new Hono<{ Bindings: Bindings }>()

bio.get('/', async (c) => {
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM bio').all()
  if (results.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json(results[0])
})

bio.put('/', async (c) => {
  const { content } = await c.req.json()
  if (!content) {
    return c.json({ error: 'Missing required fields' }, 400)
  }
  const { success } = await c.env.SR2LC_DB.prepare('UPDATE bio SET content = ? WHERE id = 1').bind(content).run()
  if (success) {
    return c.json({ message: 'Updated' })
  } else {
    return c.json({ error: 'Failed to update' }, 500)
  }
})

export default bio
