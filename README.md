# CloudChatbot - Production-Ready Cloud Computing Assistant

![CloudChatbot Banner](https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop)

A professional, modern, and production-ready AI chatbot built for the **CodeAlpha Cloud Computing Internship Task 4**. This application serves as a comprehensive assistant for all things cloud, helping users navigate AWS, Azure, GCP, Kubernetes, and more.

## 🚀 Features

- **AI-Powered Conversations**: Real-time streaming responses via Google Gemini AI.
- **Cloud Expertise**: Specialized system instructions for Cloud Computing, DevOps, and Networking.
- **Chat History**: Persistent conversation storage using Supabase PostgreSQL (via Prisma).
- **Secure Authentication**: Robust session management using Supabase SSR Auth.
- **Modern UI/UX**: Premium ChatGPT-like interface built with Next.js 15, Tailwind CSS, and shadcn/ui.
- **Advanced Markdown**: Full support for code blocks, syntax highlighting, and Mermaid diagrams.
- **Dashboard**: Track your usage stats and recent activity.
- **Dark/Light Mode**: Persisted theme preferences with smooth transitions.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Database**: Supabase PostgreSQL
- **ORM**: Prisma
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS + shadcn/ui
- **Icons**: Lucide Icons
- **Deployment**: Vercel

## ⚙️ Environment Variables

Create a `.env.local` file in the root directory and add the following variables:

```env
# Gemini API
GOOGLE_GENERATIVE_AI_API_KEY=your_gemini_api_key

# Supabase Auth & Client
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Database (Prisma)
DATABASE_URL="postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres:[password]@db.[id].supabase.co:5432/postgres"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🏗 Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/CHAKRAbdedaym/CodeAlpha_CloudChatbot.git
   cd CodeAlpha_CloudChatbot
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Initialize Prisma**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

## 🚀 Deployment

### Supabase Setup
1. Create a new Supabase project.
2. Under "Settings" -> "API", get your URL and Anon Key.
3. Under "Settings" -> "Database", get your connection strings (pooled and direct).

### Vercel Deployment
1. Push your code to GitHub.
2. Connect your repository to Vercel.
3. Add all environment variables.
4. Deploy!

## 📄 License

This project is part of the CodeAlpha Cloud Computing Internship.
read and understand befor clone <3

