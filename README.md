# 🛍️ Shopper E-commerce Platform

**Shopper** is a comprehensive, full-stack e-commerce application built using the MERN (MongoDB, Express, React, Node.js) stack. It provides a complete user shopping flow, dedicated product management via an Admin Panel, and secure user authentication including tokenized password reset functionality.

## ✨ Features

### Frontend (User) Features
* **Product Browsing:** Categorized viewing for Men's, Women's, **Popular in Women** and **New Collections**.
* **Product Details:** Individual product pages with full details and dynamic routing.
* **Shopping Cart (`/cart`):** Add, remove, and manage product quantities. Accessible by all users.
* **Secure Authentication:** User Login and Signup.
* **Password Management:** Secure **Forgot Password** flow using temporary JWTs and Mailtrap integration for email delivery.
* **Checkout Process (`/checkout`):**
    * **Access Control:** Only accessible to **logged-in users**.
    * **Order Confirmation:** After successful processing, confirms the order (e.g., "Order Confirmed" message).

### Backend (Admin) Features
* **Product Management (CRUD):** Dedicated routes for adding new products (`/admin/addproduct`).
* **Product Listing (`/admin/listproduct`):** View and manage all products.
* **Product Visibility Control:** Products are displayed only if added by the Admin, and visibility is instantly removed if the product is deleted by the Admin.
* **Role-Based Access:** Admin dashboard accessible only to authenticated admin users.

## ⚙️ Tech Stack

### Frontend
* **React:** Component-based UI development.
* **React Router DOM:** For client-side routing, utilizes `<Route>`, `<Routes>`, and the `<Outlet>` component for nested layouts.
* **Context Provider:** Used for global state management 
* **CSS/Styled Components:** Styling.

### Backend
* **Node.js & Express.js:** Server environment and RESTful API creation.
* **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM).
* **JWT (JSON Web Tokens):** Used for secure user sessions (`JWT_SECRET`) and isolated password reset tokens (`RESET_JWT_SECRET`).
* **Nodemailer & Mailtrap:** For sending password reset emails securely during development.

## 🚀 Getting Started

Follow these steps to get your development environment set up and running.

### Prerequisites

* Node.js (v18+)
* MongoDB (local installation or cloud service like MongoDB Atlas)

### 1. Backend Setup

Navigate to your backend directory (e.g., `backend` or `api`).

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Environment Variables (`.env`):**
    Create a `.env` file in the backend root and add the following configuration:
    ```env
    # Database
    MONGO_URI=mongodb://localhost:27017/shoppingcart
    
    # JWT Secrets (MUST be long, random strings for security isolation)
    JWT_SECRET=your_long_random_session_key_a8d7s7d6f5s4a9d8
    RESET_JWT_SECRET=reset_password_secret_123

    # Server Port
    PORT=3000

    # Email Configuration (for Password Reset)
    # Using Mailtrap for development testing
    MAILTRAP_HOST=smtp.mailtrap.io
    MAILTRAP_PORT=587
    MAILTRAP_USER=your_mailtrap_username
    MAILTRAP_PASS=your_mailtrap_password
    ```

3.  **Run the Server:**
    ```bash
    npm start 
    # or using nodemon: npm run dev
    ```
    The server should start on `http://localhost:3000`.

### 2. Frontend Setup

Navigate to your frontend directory (e.g., `frontend` or `react-app`).

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Configure API Base URL:**
    Ensure your API calls point to the correct backend server. (Based on your code, this is `http://localhost:3000`).

3.  **Run the App:**
    ```bash
    npm run dev
    # or npm start
    ```
    The React application should open in your browser (usually `http://localhost:5173`).

## 🔑 Authentication and Access

| Route | Access | Purpose |
| :--- | :--- | :--- |
| `/login` | Public | User login. |
| `/signup` | Public | User registration. |
| `/forgotpassword` | Public | Initiates the email-based password reset process. |
| `/resetpassword/:token` | Public (Token Required) | Allows users to set a new password. |
| `/cart` | Public | View and manage shopping cart contents. |
| `/checkout` | **Logged-in User Only** | Final order confirmation and submission. |
| `/admin` | Admin Only | Redirects to `/admin/addproduct`. |
| `/admin/addproduct` | Admin Only | Form for adding new items to the shop. |
| `/admin/listproduct` | Admin Only | View, edit, and remove all existing products. |

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page].

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
