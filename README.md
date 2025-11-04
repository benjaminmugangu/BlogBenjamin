# 📰 Multi-Tenant Blogging SaaS Application

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![Kinde Auth](https://img.shields.io/badge/Auth-Kinde-blue)](https://kinde.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase-3FCF8E?logo=supabase)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma-2D3748?logo=prisma)](https://prisma.io/)
[![Stripe](https://img.shields.io/badge/Payments-Stripe-626CD9?logo=stripe)](https://stripe.com/)
[![Tailwind CSS](https://img.shields.io/badge/UI-TailwindCSS-38B2AC?logo=tailwindcss)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)

---

## 🧩 Overview

This project is a **full-stack, multi-tenant blogging SaaS platform** built using the most modern web technologies.  
Each user can create and manage their own blog under a unique subdirectory (e.g. `/@username`), handle authentication with **Kinde**, and manage subscriptions through **Stripe** — all powered by **Next.js 15** and deployed seamlessly on **Vercel**.



---

## ⚙️ Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js 15 (App Router), Tailwind CSS, Shadcn/UI |
| **Authentication** | Kinde (Passwordless, OAuth via Google & GitHub) |
| **Database** | Supabase (PostgreSQL) + Prisma ORM |
| **Payments** | Stripe (Subscriptions + Webhooks) |
| **Validation** | Zod + Conform |
| **File Uploads** | UploadThing |
| **Deployment** | Vercel |

---

## ✨ Features

- 🔐 **Passwordless & OAuth Authentication** (Google, GitHub)
- 🪩 **Multi-Tenant Routing** (each user has their own subdirectory)
- 💰 **Stripe Subscriptions & Webhooks**
- 🧭 **Dynamic Dashboard** for article management
- 🗒️ **Create, Edit, and Delete Blog Posts**
- ⚙️ **Server-Side Validation with Zod and Conform**
- 🧱 **Supabase + Prisma Database Integration**
- 🎨 **TailwindCSS & Shadcn/UI Design System**
- ⚡ **Optimized for performance and production**
- ☁️ **Deployment ready on Vercel**

---



This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
