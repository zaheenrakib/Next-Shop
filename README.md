# NextBazaar - Global Ecommerce Platform

A modern, full-featured ecommerce web application built with Next.js, MongoDB, and Tailwind CSS. Connects China, Bangladesh, and global markets with secure payments and beautiful UI.

## 🚀 Features

### Core Features (MVP)
- ✅ **Product Catalog** - Browse premium products with categories and filters
- ✅ **Shopping Cart** - Add/remove items, update quantities, persistent cart
- ✅ **Checkout Flow** - Shipping address, payment selection, order placement
- ✅ **User Authentication** - Phone + Password login (OTP-ready architecture)
- ✅ **User Dashboard** - View orders, track status, manage profile
- ✅ **Admin Dashboard** - Manage orders, users, view analytics
- ✅ **Mocked Stripe Payment** - Complete payment flow (ready for real keys)

### UI/UX Features
- 🎨 Modern blue design theme (#2563EB primary)
- 📱 Mobile-first, fully responsive
- ⚡ Swiper.js for hero banners and product sliders
- 🎯 Pixel-perfect Tailwind CSS + shadcn/ui components
- 🔔 Toast notifications for user feedback
- ⭐ Product ratings and reviews display
- 🏷️ Discount badges and pricing

### Technical Features
- 🔐 JWT-based authentication with bcrypt password hashing
- 🗄️ MongoDB database with proper indexing
- 🎯 RESTful API architecture
- 📦 UUID-based IDs (no MongoDB ObjectIDs in responses)
- 🔄 Real-time cart updates with localStorage
- 🚢 Free shipping on orders over $100

## 📋 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, Lucide Icons
- **Slider**: Swiper.js
- **Notifications**: Sonner

## 🏁 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB running on localhost:27017
- Yarn package manager

### Installation

1. **Install dependencies**
   ```bash
   yarn install
   ```

2. **Configure environment variables**
   
   The `.env` file is already configured for development. Update when deploying:
   ```
   MONGO_URL=mongodb://localhost:27017
   DB_NAME=ecommerce_db
   JWT_SECRET=your-secret-key-change-in-production
   ```

3. **Seed admin user**
   ```bash
   node scripts/seed-admin.js
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - API: http://localhost:3000/api

## 👤 Default Accounts

### Admin Account
- **Phone**: +8801234567890
- **Password**: admin123
- **Dashboard**: `/admin`

### Test User
Create a new account via the register page `/login`

## 📁 Project Structure

```
/app
├── app/
│   ├── page.js                 # Homepage with product catalog
│   ├── login/page.js           # Login & Registration
│   ├── cart/page.js            # Shopping cart
│   ├── checkout/page.js        # Checkout flow
│   ├── dashboard/page.js       # User dashboard
│   ├── admin/page.js           # Admin dashboard
│   └── api/[[...path]]/        # API routes
│       └── route.js
│
├── components/
│   ├── Navbar.js               # Main navigation
│   ├── Footer.js               # Footer component
│   └── ProductCard.js          # Product card component
│
├── lib/
│   ├── db.js                   # MongoDB connection
│   ├── auth.js                 # Authentication utilities
│   └── sample-data.js          # Sample product data
│
└── scripts/
    └── seed-admin.js           # Admin user seeder
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:slug` - Get single product

### Orders
- `POST /api/orders` - Create new order (auth required)
- `GET /api/orders/user` - Get user orders (auth required)

### Payments
- `POST /api/payments/stripe` - Process payment (MOCKED)

### Admin
- `GET /api/admin/orders` - Get all orders
- `PUT /api/admin/orders/:id` - Update order status
- `GET /api/admin/users` - Get all users
- `GET /api/admin/analytics` - Get dashboard analytics
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product

## 💳 Payment Integration

### Current Status: MOCKED
The application includes a complete payment flow with mocked Stripe processing.

### To Add Real Stripe:
1. Get your Stripe keys from [Stripe Dashboard](https://dashboard.stripe.com)
2. Add to `.env`:
   ```
   STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
   STRIPE_SECRET_KEY=sk_test_your_key_here
   ```
3. Update `/api/payments/stripe` route with actual Stripe SDK calls

## 📱 OTP/SMS Integration (Future)

The authentication system is structured to easily add OTP:
1. Integrate Twilio or local Bangladesh SMS gateway
2. Update `/lib/auth.js` with OTP generation
3. Add OTP verification route
4. Update login flow to support OTP

## 🎨 Design System

### Colors
- **Primary**: #2563EB (Modern Blue)
- **Secondary**: #0F172A (Dark Navy) 
- **Accent**: #22C55E (Success Green)
- **Background**: #F8FAFC
- **Text**: #020617
- **Border**: #E2E8F0

### Key Features
- Consistent spacing and typography
- Hover states and transitions
- Responsive breakpoints
- Accessible color contrast

## 🔒 Security Features

- Password hashing with bcrypt (10 rounds)
- JWT tokens with 7-day expiration
- Protected API routes with token verification
- Input validation and sanitization
- CORS configuration

## 🌍 Multi-Region Support (Ready)

The platform is structured to support:
- China → China shipping
- China → Bangladesh shipping
- Global shipping options
- Multi-currency support (extensible)

## 📊 Admin Features

- Dashboard analytics (revenue, orders, users)
- Order management with status updates
- User management
- Product CRUD operations (ready)
- Real-time statistics

## 🛠️ Development

### Database Collections
- `users` - User accounts (customer + admin)
- `products` - Product catalog
- `orders` - Order records
- `cart` - (client-side localStorage)

### Adding New Products
Use the admin dashboard or directly via API:
```bash
curl -X POST http://localhost:3000/api/admin/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "price": 99.99,
    "category": "Electronics",
    "description": "Product description",
    "images": ["url1", "url2"],
    "stock": 100
  }'
```

## 📝 Next Steps / Enhancements

- [ ] Real Stripe integration with test keys
- [ ] SSLCommerz integration (Bangladesh)
- [ ] OTP/SMS integration (Twilio)
- [ ] Product reviews and ratings system
- [ ] Wishlist functionality
- [ ] Email notifications (order confirmations)
- [ ] Advanced product filters
- [ ] Product variants (size, color)
- [ ] Inventory management
- [ ] Shipping rate calculator
- [ ] Multi-currency support
- [ ] Dark mode
- [ ] Admin product image upload

## 🐛 Troubleshooting

### Server not starting
```bash
# Check supervisor logs
tail -f /var/log/supervisor/nextjs.out.log
```

### MongoDB connection issues
```bash
# Verify MongoDB is running
sudo systemctl status mongod

# Check connection string in .env
```

### Build errors
```bash
# Clear cache and rebuild
rm -rf .next
yarn dev
```

## 📄 License

This project is built for educational and commercial use.

## 🤝 Support

For issues or questions:
- Check the logs: `/var/log/supervisor/nextjs.out.log`
- Review API responses in browser DevTools
- Test endpoints with curl or Postman

---

**Built with ❤️ using Next.js, MongoDB, and Tailwind CSS**
