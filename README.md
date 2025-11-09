# SR2LC

This is a full-stack application for an artist to showcase their work, sell products, and write blog posts.

## Architecture

The application is composed of a React frontend and a Cloudflare Worker backend. The frontend is built with Vite and the backend is built with Hono.

For a more detailed overview of the project's architecture, please see the [ARCHITECTURE.md](ARCHITECTURE.md) file.

The database is a Cloudflare D1 database, the assets are stored in a Cloudflare R2 bucket, and the session data is stored in a Cloudflare KV namespace.

## Setup

1.  **Install dependencies:**

    ```bash
    npm install
    ```

2.  **Configure Cloudflare:**

    Create a `.dev.vars` file in the root of the project and add the following:

    ```
    SR2LC_JWT_SECRET="a-secure-secret-key"
    ```

    Update the `wrangler.jsonc` file with your Cloudflare account ID, and the database, R2 bucket, and KV namespace IDs.

3.  **Create the database schema:**

    ```bash
    npm run db:setup
    ```

4.  **Run the development server:**

    ```bash
    npm run dev
    ```

## Database Schema

The database schema is defined in the `worker/schema.sql` file. It consists of the following tables:

*   `gallery`: Stores information about the gallery items.
*   `products`: Stores information about the products.
*   `posts`: Stores information about the blog posts.
*   `users`: Stores information about the users.
*   `orders`: Stores information about the orders.
*   `inventory`: Stores information about the inventory.
*   `bio`: Stores information about the artist's bio.

## Deployment

To deploy the application, run the following command:

```bash
npm run deploy
```
