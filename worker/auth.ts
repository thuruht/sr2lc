
import { Hono } from 'hono';
import { sign } from 'hono/jwt';
import { setCookie } from 'hono/cookie';
import bcrypt from 'bcryptjs';

type CloudflareBindings = {
    SR2LC_DB: D1Database;
    SR2LC_JWT_SECRET: string;
}

const auth = new Hono<{ Bindings: CloudflareBindings }>();

auth.post('/login', async (c) => {
  const { username, password } = await c.req.json();
  const user = await c.env.SR2LC_DB.prepare('SELECT * FROM users WHERE username = ?').bind(username).first();

  if (!user) {
    return c.json({ error: 'User not found' }, 404);
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return c.json({ error: 'Invalid password' }, 401);
  }

  const payload = {
    sub: user.id,
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // 1 hour
  };

  const token = await sign(payload, c.env.SR2LC_JWT_SECRET);
  setCookie(c, 'token', token, { httpOnly: true, secure: true, sameSite: 'Strict' });

  return c.json({ message: 'Logged in successfully' });
});

auth.post('/register', async (c) => {
    const { username, password } = await c.req.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    const { success } = await c.env.SR2LC_DB.prepare('INSERT INTO users (username, password) VALUES (?, ?)')
        .bind(username, hashedPassword)
        .run();

    if (success) {
        return c.json({ message: 'User created successfully' });
    } else {
        return c.json({ error: 'Failed to create user' }, 500);
    }
});


export default auth;
