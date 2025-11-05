import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
  SR2LC_R2: R2Bucket
}

const products = new Hono<{ Bindings: Bindings }>()

products.get('/', async (c) => {
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM products').all()
  return c.json(results)
})

products.get('/:id', async (c) => {
  const { id } = c.req.param()
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM products WHERE id = ?').bind(id).all()
  if (results.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json(results[0])
})

products.post('/', async (c) => {
  const formData = await c.req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const image = formData.get('image') as File;

  if (!name || !price || !image) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const imageUrl = `products/${Date.now()}-${image.name}`;
  await c.env.SR2LC_R2.put(imageUrl, await image.arrayBuffer());

  const { success } = await c.env.SR2LC_DB.prepare('INSERT INTO products (name, description, price, imageUrl) VALUES (?, ?, ?, ?)')
    .bind(name, description, parseFloat(price), imageUrl)
    .run();

  if (success) {
    return c.json({ message: 'Created' }, 201)
  } else {
    return c.json({ error: 'Failed to create' }, 500)
  }
})

products.put('/:id', async (c) => {
  const { id } = c.req.param()
  const formData = await c.req.formData();
  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = formData.get('price') as string;
  const image = formData.get('image') as File;

  if (!name || !price) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  let imageUrl: string | undefined = undefined;
  if (image) {
    const oldProduct = await c.env.SR2LC_DB.prepare('SELECT imageUrl FROM products WHERE id = ?').bind(id).first<{ imageUrl: string }>();
    if (oldProduct) {
        await c.env.SR2LC_R2.delete(oldProduct.imageUrl);
    }
    imageUrl = `products/${Date.now()}-${image.name}`;
    await c.env.SR2LC_R2.put(imageUrl, await image.arrayBuffer());
  }

  const { success } = await c.env.SR2LC_DB.prepare(`UPDATE products SET name = ?, description = ?, price = ?${imageUrl ? ', imageUrl = ?' : ''} WHERE id = ?`)
    .bind(name, description, parseFloat(price), ...(imageUrl ? [imageUrl] : []), id)
    .run();

  if (success) {
    return c.json({ message: 'Updated' })
  } else {
    return c.json({ error: 'Failed to update' }, 500)
  }
})

products.delete('/:id', async (c) => {
  const { id } = c.req.param()
  const oldProduct = await c.env.SR2LC_DB.prepare('SELECT imageUrl FROM products WHERE id = ?').bind(id).first<{ imageUrl: string }>();
  if (oldProduct) {
      await c.env.SR2LC_R2.delete(oldProduct.imageUrl);
  }

  const { success } = await c.env.SR2LC_DB.prepare('DELETE FROM products WHERE id = ?').bind(id).run()
  if (success) {
    return c.json({ message: 'Deleted' })
  } else {
    return c.json({ error: 'Failed to delete' }, 500)
  }
})

export default products
