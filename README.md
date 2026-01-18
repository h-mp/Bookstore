# Online Bookstore
Assignment A2 for a course.

This application is a server-side rendered online bookstore where users can:
- Register and log in
- Browse and search books by subject, author, and title
- Add books to a shopping cart
- Proceed to checkout

## Usage
You need to have npm and Node.js installed.

Before use, install dependencies:
   ```bash
   npm install
   ```

Create an .env file in the project root with the required variables (see [.env file](#env-file)).

Start the application with
   ```bash
   npm start
   ```

## Design

The server-side application design consists of
- Routers - (Express routers)
- Controllers - (Application logic)
- Views - (EJS templates)
- MySQL Database

The following npm packages are used by the application: 

- mysql2
- express
- eJS
- express-EJS-Layouts
- express-session
- bcryptjs
- dotenv
- helmet
- morgan
- validator

## Database Setup

This application uses a MySQL database.

Remember to create all required tables before trying to use the application. 

## .env file
For the application to run correctly, please create an .env file with the following variables:
- DB_HOST
- DB_USER
- DB_PASSWORD
- DB_NAME
- PORT
- BASE_URL
- NODE_ENV (development / production)
- SESSION_ID
- SESSION_SECRET

## Restrictions and Limitations

Registration:
- Accepted zip-code formats: 12345 and 123 45.
- Emails must be unique.
- Passwords must be at least 6 characters long.

Features not yet available:
- Phone number validation (due to big differences in numbers worldwide).
- Zip codes other than before mentioned formats.
- Modifying user information after registration.
- Deleting a user account
- Removing items from the cart.
- Reducing the quantity of an item in the cart.
- Getting the order confimation as an email.