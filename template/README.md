# Hackathon Starter App 🚀

A modern, full-stack starter template for building hackathon projects quickly and efficiently. Built with the latest technologies and best practices.

## 🛠️ Tech Stack

- **Frontend**
  - Next.js 14 with App Router
  - React Query for efficient data fetching
  - Zustand for lightweight state management
  - Tailwind CSS for styling
  - TypeScript for type safety

- **Backend**
  - Next.js API Routes
  - Prisma as the ORM
  - Better-auth for authentication
  - PostgreSQL database

## ✨ Features

- 🔐 Authentication system ready to go
- 📱 Responsive design with Tailwind CSS
- 🔄 Real-time data updates with React Query
- 📦 Type-safe database operations with Prisma
- 🚀 Optimized for performance

## 🚀 Getting Started

1. **Clone the repository**
   ```bash
   git clone [your-repo-url]
   cd hackathon-starter
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up your database**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   
   # Update the DATABASE_URL in .env with your database credentials
   ```

4. **Run database migrations**
   ```bash
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser**

## 📚 Quick Start Guide

1. **Authentication**
   - The app comes with a pre-built authentication system
   - Customize providers in `src/server/auth.ts`
   - Add protected routes using the `auth` middleware

2. **Database**
   - Define your models in `prisma/schema.prisma`
   - Use Prisma Client in your API routes

3. **State Management**
   - Create stores in `src/store/`
   - Use Zustand hooks in your components
   - Example: `const useStore = create((set) => ({ ... }))`

4. **API Routes**
   - Create new routes in `src/app/api/`
   - Use React Query for data fetching

## 🎯 Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # Reusable React components
├── server/          # Backend code
│   ├── api/         # API routes
│   ├── auth/        # Authentication setup
│   └── db/          # Database utilities
├── store/           # Zustand stores
└── hooks/           # Custom React hooks
```

## 🔧 Customization

1. **Theme**
   - Modify colors in `tailwind.config.ts`
   - Update global styles in `src/app/globals.css`

2. **Components**
   - Edit components in `src/components/`
   - Add new components as needed

3. **API Routes**
   - Add new routes in `src/app/api/`
   - Create new Prisma models as needed

## 📦 Deployment

This starter is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import your project on Vercel
3. Add your environment variables
4. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [Zustand](https://github.com/pmndrs/zustand)
- [React Query](https://tanstack.com/query/latest)
- [Tailwind CSS](https://tailwindcss.com/)
