# Brux Abode — Luxury Real Estate Web App

## Project Overview
Brux Abode is a premium real estate front-end and back-end project built with static HTML/CSS/JavaScript for the storefront and a Node.js/Express backend for authentication, user role management, and order/inquiry storage.

The project includes:
- A styled landing page with luxury property listings
- Login and registration pages for members
- A property cart/interest collection page
- A property details page with dynamic content
- Admin dashboard for viewing inquiries and managing users
- Express backend with MongoDB user and order persistence

## Folder Structure

```
brux_store/
├── admin.html
├── admin-logic.js
├── auth-logic.js
├── cart.html
├── index.html
├── login.html
├── product-details.html
├── register.html
├── script.js
├── style.css
├── assets/             # branding images and assets
└── backend/
    ├── package.json
    ├── package-lock.json
    ├── server.js
    ├── .env            # local environment variables
    └── models/         # optional model folder if expanded later
```

## Frontend Description

### `index.html`
- Main landing page for the luxury portfolio
- Includes a hero section, dynamic property listing grid, filter buttons, and custom footer
- Uses `script.js` for dynamic rendering and user state management

### `style.css`
- Global luxury theme and layout styles
- Header, hero, cards, footer, auth pages, cart page, details page, and admin dashboard styling
- Supports responsive footer and mobile layouts

### `script.js`
- Manages property rendering, filtering, login state, and cart/interest actions
- Uses browser `localStorage` to store member tokens and selected interest list
- Renders product details and cart summary pages dynamically
- Sends order/inquiry POST requests to the backend API

### `auth-logic.js`
- Handles registration and login form submission
- Sends requests to the backend `/api/auth/register` and `/api/auth/login` endpoints
- Stores JWT token, role, and username in `localStorage` after successful login
- Redirects members to `index.html` or `admin.html` if role is admin

### `login.html` and `register.html`
- Member authentication pages with luxury glass-card layout
- Uses `auth-logic.js` to validate input and connect to backend auth endpoints

### `cart.html`
- Interest collection page for selected properties
- Displays saved items and summary totals
- Sends inquiry requests through `processOrder()`

### `product-details.html`
- Product details page for single property view
- Loads property data using query string `?id=` and renders full property details dynamically

### `admin.html`
- Admin control center for order inquiries and user privilege management
- Uses `admin-logic.js` to fetch orders and user lists from secured backend admin endpoints
- Provides admin actions for promoting users and contacting clients

## Backend Description

### `backend/server.js`
- Express server with MongoDB/Mongoose integration
- Uses `bcryptjs` for password hashing and `jsonwebtoken` for token generation
- Supports CORS and JSON request parsing

Key backend features:
- `POST /api/auth/register` — create a new user with hashed password and role assignment
- `POST /api/auth/login` — authenticate user and return JWT token + role
- `POST /api/orders` — save property inquiry order data to MongoDB
- `GET /api/admin/orders` — fetch customer inquiries for admin
- `GET /api/admin/users` — fetch registered user profiles (password excluded)
- `PATCH /api/admin/promote/:id` — promote a user to `staff` or `admin`

### `backend/.env`
The backend expects the following environment variables:

```env
PORT=5000
MONGO_URI=your-mongodb-connection-string
ADMIN_EMAIL=your-admin-email@example.com
JWT_SECRET=your-secret-key
```

> Important: Do not commit your real MongoDB URI or JWT secret to version control.

## How to Run

### 1. Start the backend

```bash
cd backend
npm install
node server.js
```

If you already have dependencies installed, you can simply run:

```bash
cd backend
node server.js
```

The backend server starts on `http://localhost:5000` by default.

### 2. Open the frontend

The frontend is static and can be opened directly in the browser.

Recommended:

```bash
cd ..
npx live-server .
```

Or open `index.html` in your browser.

### 3. Use the app
- Visit `index.html` to browse properties
- `login.html` to sign in
- `register.html` to create an account
- `cart.html` to review your interest list
- `product-details.html?id=<id>` to view a property detail
- `admin.html` if your logged-in role is `admin`

## Auth Flow
- Registration sends data to `/api/auth/register`
- Login sends credentials to `/api/auth/login`
- Login saves `brux_token`, `brux_role`, and `brux_user` in `localStorage`
- The client JavaScript uses this login state to show member-only content and enable cart actions

## Notes and Improvements
- The frontend is currently static HTML/CSS/JS, so it does not require a build step
- Backend authentication is token-based, but the frontend only stores the token and uses it for session state; currently, token validation is not checked on every request from the browser
- Admin actions are controlled by local role state and backend endpoints
- Replace any hard-coded secrets in `.env` with secure values before deploying

## Recommended Enhancements
- Add a root `package.json` for frontend tooling if needed
- Validate `auth-logic.js` register form variables carefully
- Implement full JWT auth checks for protected backend routes
- Add real social links and legal page destinations

## Contact
This project is designed as a luxury real estate experience with membership and admin management. Use the backend URL settings and local `index.html` pages to preview the full user flow from landing page to admin dashboard.
