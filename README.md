# NS Challenge - Competition Ready Stack 🚀

Competition-ready monorepo built with Next.js, Supabase, Tailwind CSS, and ShadCN/UI for rapid development and seamless deployment.

## ⚡ Quick Start

### 🚀 Automated Setup (Recommended)
```bash
# Clone and install
git clone https://github.com/merkabaone/ns-challenge.git
cd ns-challenge

# One-command setup (installs deps, sets up env, initializes components)
npm run setup

# Start development
npm run dev
```

### 🔧 Manual Setup
```bash
# Clone and install
git clone https://github.com/merkabaone/ns-challenge.git
cd ns-challenge
npm install

# Setup environment (interactive CLI)
npm run setup:env

# Initialize ShadCN/UI
npx shadcn@latest init

# Start development
npm run dev
```

## 🏗️ Architecture

- **Frontend**: Next.js 14 (App Router) + TypeScript
- **Backend**: Supabase (Auth, Database, Storage)
- **Styling**: Tailwind CSS + ShadCN/UI Components
- **Deployment**: Vercel (Zero-config)

## 📦 Stack

- **Framework**: Next.js 14 with App Router
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS + ShadCN/UI
- **State**: Zustand (lightweight state management)
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Deployment**: Vercel

## 🚀 Competition Features

- **Instant Deploy**: `npm run deploy` to Vercel
- **Fast Development**: Hot reload, TypeScript, optimized builds
- **Component Library**: Pre-built ShadCN/UI components
- **Database Ready**: Supabase integration with type generation
- **Authentication**: Drop-in auth with Supabase
- **Responsive**: Mobile-first design with Tailwind CSS

## 📂 Project Structure

```
ns-challenge/
├── app/                    # Next.js App Router
│   ├── globals.css         # Global styles
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── components/             # React components
│   ├── ui/                 # ShadCN/UI components
│   └── custom/             # Custom components
├── lib/                    # Utilities and configurations
│   ├── supabase/           # Supabase clients
│   ├── utils.ts            # Utility functions
│   └── types.ts            # TypeScript types
├── hooks/                  # Custom React hooks
└── public/                 # Static assets
```

## 🔧 Available Scripts

### 🚀 Setup & Development
```bash
npm run setup        # Complete automated setup (recommended)
npm run setup:env    # Interactive environment setup
npm run setup:supabase # Supabase project setup
npm run setup:vercel  # Vercel deployment setup
npm run dev          # Start development server
```

### 🛠️ Build & Deploy
```bash
npm run build        # Build for production
npm run start        # Start production server
npm run deploy       # Deploy to Vercel
```

### 🔍 Quality & Types
```bash
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
npm run db:generate-types # Generate Supabase types
```

## 🗄️ Database Setup

### 🚀 Automated (Recommended)
```bash
npm run setup:supabase
```
This will:
- Install Supabase CLI (if needed)
- Login to your Supabase account
- Create/link your project
- Generate TypeScript types
- Update environment variables

### 🔧 Manual Setup
1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy your project URL and anon key to `.env.local`
3. Use the Supabase dashboard to create tables
4. Generate TypeScript types:
   ```bash
   npm run db:generate-types
   ```

## 🎨 Adding Components

```bash
# Add ShadCN/UI components
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add input
npx shadcn@latest add form
```

## 🚀 Deployment

### 🚀 Automated Vercel Setup
```bash
npm run setup:vercel
```
This will:
- Install Vercel CLI (if needed)
- Login to your Vercel account
- Deploy your project
- Automatically set environment variables from `.env.local`

### 🔧 Manual Vercel Setup
```bash
# One-time setup
npm install -g vercel
vercel login

# Deploy
npm run deploy
```

### Environment Variables
The automated setup will handle this, but if setting manually:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 🎯 Competition Tips

### ⚡ Speed Tips
1. **Use automated setup**: `npm run setup` gets you running in 60 seconds
2. **Deploy early**: `npm run setup:vercel` for instant deployment
3. **Use ShadCN/UI**: Pre-built, customizable components
4. **Mobile-first**: Design for mobile, enhance for desktop

### 🛠️ Development Tips
1. **Type safety**: Use TypeScript for better development experience
2. **Database-first**: Design your schema early with Supabase
3. **Component library**: Build reusable components in `components/custom/`
4. **Environment setup**: Use different `.env.local` for development vs production

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [ShadCN/UI Documentation](https://ui.shadcn.com)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vercel Documentation](https://vercel.com/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ for competition success!