import { Hono } from 'hono';
import { verify } from 'hono/jwt';
import { getCookie } from 'hono/cookie';
import gallery from './gallery';
import products from './products';
import posts from './posts';
import auth from './auth';
import bio from './bio';

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

const app = new Hono<{ Bindings: Bindings }>();

app.use('/api/admin/*', async (c, next) => {
  const token = getCookie(c, 'token');
  if (!token) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const payload = await verify(token, c.env.JWT_SECRET);
    c.set('user', payload);
    await next();
  } catch (e) {
    return c.json({ error: 'Unauthorized' }, 401);
  }
});

app.route('/api/gallery', gallery);
app.route('/api/products', products);
app.route('/api/posts', posts);
app.route('/api/auth', auth);
app.route('/api/bio', bio);

app.get('/api/admin/test', (c) => {
    const user = c.get('user');
    return c.json({ message: 'You are authorized', user });
});

export default app;