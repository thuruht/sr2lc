import { Hono } from 'hono'

type Bindings = {
  SR2LC_DB: D1Database
  SR2LC_R2: R2Bucket
}

const gallery = new Hono<{ Bindings: Bindings }>()

gallery.get('/', async (c) => {
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM gallery').all()
  return c.json(results)
})

gallery.get('/:id', async (c) => {
  const { id } = c.req.param()
  const { results } = await c.env.SR2LC_DB.prepare('SELECT * FROM gallery WHERE id = ?').bind(id).all()
  if (results.length === 0) {
    return c.json({ error: 'Not found' }, 404)
  }
  return c.json(results[0])
})

gallery.post('/', async (c) => {
  const formData = await c.req.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  if (!title || !image) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  const imageUrl = `gallery/${Date.now()}-${image.name}`;
  await c.env.SR2LC_R2.put(imageUrl, await image.arrayBuffer());

  const { success } = await c.env.SR2LC_DB.prepare('INSERT INTO gallery (title, description, imageUrl) VALUES (?, ?, ?)').bind(title, description, imageUrl).run()
  if (success) {
    return c.json({ message: 'Created' }, 201)
  } else {
    return c.json({ error: 'Failed to create' }, 500)
  }
})

gallery.put('/:id', async (c) => {
  const { id } = c.req.param()
  const formData = await c.req.formData();
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const image = formData.get('image') as File;

  if (!title) {
    return c.json({ error: 'Missing required fields' }, 400)
  }

  let imageUrl: string | undefined = undefined;
  if (image) {
    const oldGalleryItem = await c.env.SR2LC_DB.prepare('SELECT imageUrl FROM gallery WHERE id = ?').bind(id).first<{ imageUrl: string }>();
    if (oldGalleryItem) {
        await c.env.SR2LC_R2.delete(oldGalleryItem.imageUrl);
    }
    imageUrl = `gallery/${Date.now()}-${image.name}`;
    await c.env.SR2LC_R2.put(imageUrl, await image.arrayBuffer());
  }

  const { success } = await c.env.SR2LC_DB.prepare(`UPDATE gallery SET title = ?, description = ?${imageUrl ? ', imageUrl = ?' : ''} WHERE id = ?`)
    .bind(title, description, ...(imageUrl ? [imageUrl] : []), id)
    .run();

  if (success) {
    return c.json({ message: 'Updated' })
  } else {
    return c.json({ error: 'Failed to update' }, 500)
  }
})

gallery.delete('/:id', async (c) => {
  const { id } = c.req.param()
  const oldGalleryItem = await c.env.SR2LC_DB.prepare('SELECT imageUrl FROM gallery WHERE id = ?').bind(id).first<{ imageUrl: string }>();
  if (oldGalleryItem) {
      await c.env.SR2LC_R2.delete(oldGalleryItem.imageUrl);
  }

  const { success } = await c.env.SR2LC_DB.prepare('DELETE FROM gallery WHERE id = ?').bind(id).run()
  if (success) {
    return c.json({ message: 'Deleted' })
  } else {
    return c.json({ error: 'Failed to delete' }, 500)
  }
})

export default gallery
