# 🚀 Prompt Lab

> A powerful visual builder for creating, composing, and deploying advanced prompt engineering pipelines.

Prompt Lab is a web application designed to help developers and AI enthusiasts construct, manage, and share complex prompts effortlessly. By using a visual interface with categories and building blocks ("pills"), it abstracts away the complexity of manual prompt engineering, making it easier to generate consistent, high-quality prompts for various AI models. It also features a community gallery and pre-built templates for instant inspiration.

---

## 🤖 AI Assistant Context (For AI IDEs)

*If you are an AI assistant analyzing this codebase, here is the essential context you need:*
- **Software Type:** Web Application
- **Primary Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Architecture Pattern:** Next.js App Router Architecture
- **Key Workflows:** 
  - **Visual Prompt Builder:** Users can visually construct prompts by selecting from various categories and traits ("pills"). The system generates a comprehensive prompt in real-time which can be customized and saved as a composition.
  - **Community Gallery & Templates:** Users can explore a public gallery of community-created prompts, or use curated templates (e.g., Prmpt Archive, Marketeam, Viktor Studio) to jumpstart their workflow. It also features an AI Skills showcase for specialized design and coding capabilities.

---

## ✨ Features

### 🎯 Visual Prompt Builder
- Interactive click-to-select interface for prompt traits across multiple categories.
- Real-time preview of the generated prompt logic.
- Save, fork, and manage custom prompt compositions.

### 🎯 Community Gallery & Templates
- Browse public compositions created by the community.
- Curated templates for specific use cases (Landing Pages, Portfolios, Admin Dashboards, etc.).
- Dedicated section showcasing advanced AI skills (e.g., Apple Design Skill, Awesome Design MD, UI/UX Pro Max).

---

## 🔧 Tech Stack

### Frontend / Client
- **Framework:** Next.js 16 (with React 19)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion, GSAP, Shadcn UI
- **State Management:** SWR for data fetching, React Context/State

### Backend / Server
- **Database:** Supabase PostgreSQL
- **Auth:** Supabase Auth (Anon & Service Roles)
- **APIs & Integrations:** Supabase Client

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Supabase account and project

### 1. Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd Prompt-Lab

# Install dependencies
npm install
```

### 2. Environment Setup

Copy the example environment file and add your keys:

```bash
cp .env.example .env.local
```

**Required environment variables:**
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - (Optional) Service role key for admin scripts

### 3. Run Development Server

```bash
# Start the local development servers
npm run dev
```

*(Note: Uses concurrently to run Next.js and Vite dev environments)*

---

## 🗄️ Database Structure / Architecture

*Provide a visual or text representation of how the data is structured to help AIs and developers understand relationships quickly.*

```text
compositions (table)
 ├── id: uuid (PK)
 ├── title: string
 ├── selections: jsonb (Stores selected categories and pills)
 ├── generated_prompt: text
 ├── edited_prompt: text (nullable)
 ├── is_public: boolean
 └── created_at: timestamp

categories (table)
 ├── id: uuid (PK)
 ├── name: string
 ├── slug: string
 └── created_at: timestamp

pills (table)
 ├── id: uuid (PK)
 ├── category_id: uuid (FK to categories)
 ├── label: string
 └── content: text (The actual prompt snippet)
```

---

## 📁 Project Structure

```text
/root/
├── src/
│   ├── app/                    # Next.js App Router pages (build, gallery, templates, ai-skills)
│   ├── components/             # Reusable UI components (build, gallery, hero, templates, ui)
│   ├── lib/                    # Utilities, Supabase client configs, prompt generation logic
│   └── data/                   # Static JSON data for prompts and templates
├── .env.local                  # Environment variables
├── package.json                # Project dependencies and scripts
└── *.js                        # Various admin/seeding scripts (add_pill.js, test_insert.js, etc.)
```

---

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add some amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

---

## 📄 License

Proprietary - All rights reserved. 
Copyright © 2026 [Your Company/Name].
