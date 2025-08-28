# Product E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 14, MongoDB, and Razorpay payment integration.

## Features

- **Product Catalog**: Browse products with detailed views
- **Shopping Cart**: Add/remove items with quantity management
- **User Authentication**: Secure login/register system
- **Payment Processing**: Razorpay integration for secure payments
- **Order Management**: Track orders and view order history
- **Responsive Design**: Mobile-first responsive design
- **Modern UI**: Clean, modern interface with smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Payment**: Razorpay
- **Styling**: Tailwind CSS, shadcn/ui components
- **Icons**: Lucide React

## Prerequisites

- Node.js 18+ 
- MongoDB (local or MongoDB Atlas)
- Razorpay account (for payment processing)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd productecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```bash
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/productecommerce

   # NextAuth
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here

   # Razorpay
   RAZORPAY_KEY_ID=your-razorpay-key-id
   RAZORPAY_KEY_SECRET=your-razorpay-key-secret

   # Email (optional)
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

4. **Set up MongoDB**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGODB_URI` in `.env.local` with your connection string

5. **Set up Razorpay**
   - Create an account at [Razorpay](https://razorpay.com)
   - Get your API keys from the dashboard
   - Update `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` in `.env.local`

6. **Run the development server**
   ```bash
   npm run dev
   ```

7. **Access the application**
   Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
productecommerce/
├── app/
│   ├── api/
│   │   ├── products/          # Product API routes
│   │   ├── cart/             # Cart API routes
│   │   ├── orders/           # Order API routes
│   │   └── payment/          # Payment API routes
│   ├── (root)/
│   │   ├── (website)/
│   │   │   ├── products/     # Product pages
│   │   │   ├── cart/         # Cart page
│   │   │   ├── checkout/     # Checkout page
│   │   │   ├── order-success/# Order success page
│   │   │   └── my-account/   # User account pages
│   │   └── auth/             # Authentication pages
├── components/
│   ├── ui/                   # UI components
│   └── website/              # Website-specific components
├── lib/
│   ├── mongodb.js           # MongoDB connection
│   ├── auth.js              # NextAuth configuration
│   └── razorpay.js          # Razorpay configuration
├── models/
│   ├── Product.model.js     # Product schema
│   ├── Cart.model.js        # Cart schema
│   └── Order.model.js       # Order schema
└── public/
    └── images/              # Static images
```

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/[slug]` - Get product by slug

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/[productId]` - Add item to cart
- `PUT /api/cart/[productId]` - Update cart item
- `DELETE /api/cart/[productId]` - Remove item from cart

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/[orderId]` - Get specific order

### Payment
- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify-payment` - Verify payment

## Usage

### Adding Products
Products are automatically seeded when the server starts. You can add more products by:
1. Adding them to the database directly
2. Creating an admin interface (future enhancement)

### Testing Payments
For testing Razorpay payments:
- Use test mode keys
- Use test card: `4111 1111 1111 1111`
- Use any future expiry date and any 3-digit CVV

## Development

### Adding New Features
1. Create API routes in `app/api/`
2. Create corresponding pages in `app/(root)/(website)/`
3. Update models as needed
4. Test thoroughly

### Database Schema
- **Product**: name, description, price, images, category, stock
- **Cart**: user, items (product, quantity)
- **Order**: user, items, totalAmount, paymentStatus, status

## Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Import project on Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms
- Ensure MongoDB is accessible
- Set all environment variables
- Build and start the application

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License
This project is licensed under the MIT License.

## Support
For support, please open an issue in the GitHub repository.
