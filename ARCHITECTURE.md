# Architecture

This document provides a more detailed overview of the project's architecture.

## Frontend

The frontend is a React application built with Vite. It uses React Router for routing and PayPal's React component for processing payments. The application is divided into the following pages:

*   **Home:** The home page.
*   **Gallery:** A gallery of the artist's work.
*   **Shop:** A shop where users can buy products.
*   **Blog:** A blog where the artist can write posts.
*   **Admin:** An admin page where the artist can manage the gallery, products, and blog posts.

## Backend

The backend is a Cloudflare Worker built with Hono. It provides a RESTful API for the frontend to consume. The API is divided into the following resources:

*   **Gallery:** The gallery resource provides endpoints for managing the gallery items.
*   **Products:** The products resource provides endpoints for managing the products.
*   **Posts:** The posts resource provides endpoints for managing the blog posts.
*   **Auth:** The auth resource provides endpoints for user authentication.
*   **Bio:** The bio resource provides endpoints for managing the artist's bio.

## Database

The database is a Cloudflare D1 database. The database schema is defined in the `worker/schema.sql` file. It consists of the following tables:

*   `gallery`: Stores information about the gallery items.
*   `products`: Stores information about the products.
*   `posts`: Stores information about the blog posts.
*   `users`: Stores information about the users.
*   `orders`: Stores information about the orders.
*   `inventory`: Stores information about the inventory.
*   `bio`: Stores information about the artist's bio.

## Assets

The assets are stored in a Cloudflare R2 bucket. The assets include images for the gallery, products, and blog posts.

## Session

The session data is stored in a Cloudflare KV namespace. The session data includes the user's session token.
