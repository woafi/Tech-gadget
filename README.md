# 🛒 Tech Gadget

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

</div>

A modern full-stack e-commerce web app for tech products built with Next.js, TypeScript, Prisma, and PostgreSQL. The project includes user authentication, shopping cart, wishlist, checkout, order history, SSLCommerz payment integration, and automated order confirmation emails sent to customers via Nodemailer.

## 🌐 Live Demo

- Live site: https://tech-gadget-live.vercel.app
- GitHub: https://github.com/woafi/Tech-gadget

## ✨ Features

- Responsive product catalog with search and filtering
- User authentication with email/password and Google OAuth
- Persistent shopping cart and wishlist
- Checkout flow with order creation and order history
- SSLCommerz payment integration
- Order confirmation emails sent to customers with Nodemailer
- Dark/light theme support
- Prisma ORM with PostgreSQL database
- Server-side API routes built with Next.js App Router

## 🛠️ Tech Stack

- Frontend: Next.js, React, TypeScript, Tailwind CSS, Framer Motion, Zustand
- Forms & validation: React Hook Form, Zod
- Backend/API: Next.js API Routes, Prisma ORM
- Authentication: JWT via cookies, bcrypt, Google OAuth
- Database: PostgreSQL (Supabase)
- Payments: SSLCommerz
- Deployment: Vercel

## 📁 Project Structure

```text
.
├── app/                # Next.js App Router pages and API routes
├── components/         # Reusable UI components
├── lib/                # Auth, OAuth, and shared server logic
├── prisma/             # Prisma schema and seed data
├── public/             # Static assets and product images
├── stores/             # Zustand stores
├── utils/              # Prisma client and validation helpers
├── package.json
└── README.md
```

## ✅ Prerequisites

Before running the project locally, make sure you have:

- Node.js 18+
- npm or pnpm
- PostgreSQL database (local or Supabase)
- Git

## ⚙️ Environment Variables

Create a `.env` file in the project root with the following variables:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
JWT_SECRET="your-very-secure-secret"

# Optional but recommended for OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
GOOGLE_REDIRECT_URI="http://localhost:3000/api/auth/google/callback"

# Optional for payment integration
SSL_STORE_ID="your-ssl-store-id"
SSL_STORE_PASSWORD="your-ssl-store-password"
SSL_IS_LIVE="false"

# Optional email configuration for order confirmation emails
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Optional app URL settings
NEXT_PUBLIC_APP_URL="http://localhost:3000"
CLIENT_URL="http://localhost:3000"
BACKEND_API_URL="http://localhost:3000"
```

## ▶️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up the database

If you are using Prisma with PostgreSQL, run:

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

### 3. Start the development server

```bash
npm run dev
```

Open http://localhost:3000 to view the app.

## 🧪 Demo Notes

- You can create a new account from the sign-up page.
- Google OAuth can be enabled by configuring the Google credentials above.
- Seed data will populate categories and sample products.

## 🚀 Deployment on Vercel

This project is designed to be deployed on Vercel for free-tier use.

### Recommended deployment flow

1. Push the project to GitHub.
2. Create a new project on Vercel and connect the repository.
3. Add the same environment variables in the Vercel dashboard.
4. Use your Supabase PostgreSQL connection string as `DATABASE_URL`.
5. Deploy.

> For production, set `NEXT_PUBLIC_APP_URL`, `CLIENT_URL`, and `BACKEND_API_URL` to your Vercel domain.

## 📦 Database

The app uses Prisma with a PostgreSQL database. If you are using Supabase:

1. Create a Supabase project.
2. Open Project Settings → Database.
3. Copy the connection string.
4. Paste it into `DATABASE_URL`.

## 📄 License

This project is open-source and available for learning purpose.

## 👨‍💻 Author

Built as a modern full-stack e-commerce project using Next.js and Prisma.
