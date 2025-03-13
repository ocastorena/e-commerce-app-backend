# E-Commerce App Backend

This repository contains the backend for an e-commerce platform. The project implements RESTful API endpoints for managing users, products, carts, and orders. It also includes user authentication using Passport, robust error handling, and a comprehensive test suite.

## Technologies Used

- **Node.js & Express**  
  Provides a fast and minimalist server for handling HTTP requests.

- **PostgreSQL**  
  A powerful relational database system used to store data on users, products, carts, orders, etc.

- **Passport.js**  
  Handles user authentication using a local strategy.

- **Swagger (swagger-jsdoc & swagger-ui-express)**  
  Used to auto-generate and serve API documentation based on JSDoc annotations.

- **Mocha, Chai & Supertest**  
  Provides a testing framework and HTTP assertions to validate API endpoints.

- **bcrypt**  
  Used for hashing passwords before storing them in the database.

- **dotenv**  
  Manages configuration via environment variables.

## Installation

1. **Clone the repository:**

   ```
   git clone https://github.com/ocastorena/e-commerce-app-backend.git
   cd e-commerce-app-backend
   ```

2. **Install dependencies:**

   ```
   npm install
   ```

3. **Set up your environment variables:**  
   Create a `.env` file in the root directory and configure your PostgreSQL credentials:

   ```
   PGUSER=postgres
   PGPASSWORD=postgres
   PGHOST=localhost
   PGDATABASE=e-commerce
   PGPORT=5432
   ```

4. **Run the application:**
   ```
   npm start
   ```
   The server will listen on port 3000 by default.

## Database Setup

This project uses PostgreSQL as the database. To create the required database tables, follow these steps:

1. **Create the Database:**  
   Open your terminal and run the following command (adjust parameters as necessary) to create a new database (e.g. `e-commerce`):

   ```bash
   psql -U postgres -c "CREATE DATABASE e-commerce;"
   ```

2. **Run the Initialization Script:**  
   An SQL script to set up all required tables is provided in the `config` folder (the file is named `init_db.sql`). To run this script, execute the following command from the root directory of the project:

   ```bash
   psql -U postgres -d e-commerce -f config/init_db.sql
   ```

   This command connects to your `e-commerce` database and creates the following tables:

   - `users`
   - `payment_methods`
   - `products`
   - `carts`
   - `cart_items`
   - `orders`
   - `order_items`

3. **Verify Setup:**  
   You can verify the tables were created by connecting to your database with `psql`:

   ```bash
   psql -U postgres -d e-commerce
   ```

   Then run:

   ```sql
   \dt
   ```

   This will list all tables in your database. You should see the tables listed above.

> **Note:** Make sure your environment variables in the `.env` file match the credentials you use in the commands above (e.g., `PGUSER`, `PGPASSWORD`, `PGDATABASE`).

Once you have completed these steps, your PostgreSQL database will be ready and connected to the application.

## Testing

Run the test suite using Mocha by executing:

```
npm test
```

## API Documentation

Swagger documentation is generated using JSDoc comments and is available at the following endpoints:

- **Swagger JSON Specification:**  
  [http://localhost:3000/swagger.json](http://localhost:3000/swagger.json)
- **Interactive Swagger UI:**  
  [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

## Project Endpoints Overview

### Users

- **POST `/users`**  
  Create a new user.
- **GET `/users/{email}`**  
  Retrieve a specific user by email.
- **PUT `/users/{email}`**  
  Update an existing user by email.
- **DELETE `/users/{email}`**  
  Delete a user by email.
- **GET `/users/{user_id}/cart`**  
  Retrieve the current cart for a user.
- **GET `/users/{user_id}/orders`**  
  Retrieve orders placed by a user.
- **GET `/users/{user_id}/payment-methods`**  
  Retrieve a user's payment methods.
- **POST `/login`** and **GET `/logout`**  
  Login and logout for user authentication.

### Products

- **GET `/products`**  
  Retrieve a list of all products (with optional pagination and search filtering).
- **GET `/products/{product_id}`**  
  Retrieve a specific product by its ID.
- **GET `/products/category/{category}`**  
  Retrieve all products from a specific category.
- **PUT `/products/{product_id}`**  
  Update an existing product by its ID.

### Carts

- **POST `/cart`**  
  Create a new cart.
- **GET `/cart/{user_id}`**  
  Retrieve cart details for a specific user.
- **DELETE `/cart/{user_id}`**  
  Delete a cart by user.
- **POST `/cart/{cart_id}/checkout`**  
  Initiate the checkout process and create an order if successful.

### Orders

- **GET `/orders/{order_id}`**  
  Retrieve details of a specific order.
- **GET `/orders/{order_id}/items`**  
  Retrieve items for a specific order.

## Author

Omar Castorena
