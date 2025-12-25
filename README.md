# 🛍️ Brutal Shop - Modern E-Commerce Platform

> A full-stack e-commerce application built with Next.js 16, featuring a bold Neo-Brutalist design, real-time shopping experience, and comprehensive admin dashboard.

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-7.0-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?style=for-the-badge&logo=postgresql)](https://www.postgresql.org/)

## 🎯 Project Overview

**Brutal Shop** is a modern, feature-rich e-commerce platform developed as a portfolio project to showcase full-stack development skills. The application demonstrates proficiency in modern web technologies, UI/UX design, authentication systems, payment integration, and cloud services.

### ✨ Key Highlights

- **Bold Neo-Brutalist Design** - Distinctive visual identity with thick borders, hard shadows, and vibrant colors
- **Full E-Commerce Functionality** - Complete shopping cart, wishlist, order management, and checkout flow
- **Secure Authentication** - Email/password and OAuth (Google) with session management
- **Payment Integration** - Midtrans payment gateway for Indonesian market
- **Admin Dashboard** - Comprehensive admin panel with analytics, product management, and order tracking
- **Real-time Features** - Infinite scroll, optimistic updates, and smooth animations
- **Cloud Storage** - Tigris S3 integration for image uploads
- **Email Notifications** - Automated emails for verification and order updates

---

## 🚀 Core Features

### 👤 User Features

#### **Authentication & Profile**

- Email/password registration and login
- OAuth integration (Google)
- Email verification system
- Password reset functionality
- User profile management with avatar upload
- Address management (up to 2 addresses)
- Session management with device tracking

#### **Shopping Experience**

- Product browsing with infinite scroll
- Advanced search and filtering
- Category-based navigation
- Shopping cart with quantity management
- Wishlist functionality
- Product detail pages with image galleries
- Related product recommendations

#### **Order Management**

- Secure checkout process
- Multiple payment methods (Midtrans)
- Order history with infinite scroll
- Order status tracking
- Detailed order receipt

### 🔐 Admin Features

#### **Dashboard & Analytics**

- Real-time sales statistics
- Revenue tracking with charts
- Customer insights
- Recent orders overview
- Date range filtering

#### **Product Management**

- CRUD operations for products
- Image upload and management
- Category assignment
- Stock management
- Featured products selection
- Status tracking (New/Used)

#### **Category Management**

- Create and edit categories
- Category image upload
- Active/inactive status toggle

#### **User Management**

- View all registered users
- Role management
- User activity monitoring
- Secure deletion rules

#### **Order Management**

- View and filter orders
- Status updates
- Order details with product information

---

## 🛠️ Tech Stack

### **Frontend**

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **UI Components:** Shadcn UI
- **Animations:** Framer Motion
- **Form Handling:** React Hook Form + Zod
- **Charts:** Recharts
- **Icons:** Lucide React

### **Backend**

- **Runtime:** Node.js
- **Database:** PostgreSQL
- **ORM:** Prisma 7
- **Authentication:** Better Auth
- **File Upload:** Tigris Storage
- **Payment:** Midtrans Client
- **Email:** Nodemailer

### **Development Tools**

- **Package Manager:** Bun
- **Linter:** ESLint
- **React Compiler:** Babel Plugin

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** 20 or higher
- **Bun** (recommended) or npm/yarn/pnpm
- **PostgreSQL** 16 or higher
- **Git**

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/peterVoid/normal-ecommerce.git
cd loh-wok
```

### 2️⃣ Install Dependencies

```bash
# Using Bun (recommended)
bun install

# Or using npm
npm install
```

### 3️⃣ Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/lohwok"

# Better Auth
BETTER_AUTH_SECRET="your-secret-key-here"
BETTER_AUTH_URL="http://localhost:3000"

# OAuth Providers (Optional)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GITHUB_CLIENT_ID="your-github-client-id"
GITHUB_CLIENT_SECRET="your-github-client-secret"

# AWS S3
AWS_REGION="your-aws-region"
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_BUCKET_NAME="your-bucket-name"

# Midtrans
MIDTRANS_SERVER_KEY="your-midtrans-server-key"
MIDTRANS_CLIENT_KEY="your-midtrans-client-key"

# Email (Nodemailer)
GOOGLE_APP_PASSWORD="your-google-app-password"
```

### 4️⃣ Database Setup

```bash
# Generate Prisma Client
bunx prisma generate

# Run database migrations
bunx prisma migrate deploy

# (Optional) Seed the database with sample data
bunx prisma db seed
```

### 5️⃣ Run Development Server

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

---

## 🗂️ Project Structure

```
loh-wok/
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── src/
│   ├── app/                   # Next.js app router
│   │   ├── (admin)/          # Admin routes
│   │   ├── (auth)/           # Auth routes
│   │   └── (consumer)/       # Public routes
│   ├── components/            # Reusable UI components
│   ├── dal/                   # Data access layer
│   ├── features/              # Feature-specific components
│   ├── generated/             # Generated Prisma types
│   ├── lib/                   # Utilities and configurations
│   └── types/                 # TypeScript type definitions
├── .env                       # Environment variables
├── package.json
└── README.md
```

---

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Railway / Render

1. Connect your GitHub repository
2. Set up PostgreSQL database
3. Add environment variables
4. Deploy using build command: `bun run build`
5. Start command: `bun start`

---

## 🧪 Testing

```bash
# Run linter
bun run lint

# Type checking
bunx tsc --noEmit
```

---

## 📸 Screenshots

### Admin Dashboard

![Admin Dashboard](public/showcases/admin-dashboard.png)

## 🎨 Design Philosophy

This project embraces **Neo-Brutalism** - a design trend characterized by:

- Bold, thick borders
- Hard drop shadows
- Vibrant, contrasting colors
- Playful, animated interactions
- Raw, honest user interface

---

## 🤝 Contributing

This is a personal portfolio project, but feedback and suggestions are welcome! Feel free to open issues or submit pull requests.

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Haikal Prasetya**

- Portfolio: (https://portfolio-xi-six-ou69qsqvqu.vercel.app)
- LinkedIn: (https://www.linkedin.com/in/haikal-alhakim-b02626287)
- GitHub: (https://github.com/peterVoid)

---

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Vercel for hosting and deployment
- Prisma for the excellent ORM
- All open-source contributors

---

<div align="center">
  <p>Built with ❤️ using Next.js</p>
  <p>© 2025 Brutal Shop. All rights reserved.</p>
</div>
