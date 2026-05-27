<div align="center">

# **DevCollab — Real-Time Project Collaboration Platform for Developers**

<p align="center">
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Socket.IO-Realtime-010101?style=for-the-badge&logo=socket.io&logoColor=white" />
  <img src="https://img.shields.io/badge/Stripe-Sandbox-008CDD?style=for-the-badge&logo=stripe&logoColor=white" />
</p>

### 🚀 [**View Live Demo**](https://dev-collab-real-time-project-collab.vercel.app/)

</div>

---

## 📖 About The Project

**DevCollab** is a full-stack, real-time collaboration platform purpose-built for student developer teams. It brings together everything a modern engineering team needs — without the tab chaos of juggling Trello, Notion, GitHub Gists, and Slack separately.

Think **GitHub meets Notion meets Slack**, designed for teams that want to move fast. Inside a single workspace, your team can manage projects end-to-end: plan sprints on a Kanban board, write shared documentation, store reusable code snippets, sketch architecture on a **collaborative AI-powered whiteboard**, track team health with **Dev Pulse analytics**, and let an AI assistant handle standups, blockers, and code reviews — all updating live as teammates work.

DevCollab was built for the **DevFusion: The Developers Hackathon 2.0** under the problem statement:

> *"Build a GitHub-meets-Notion-meets-Slack platform designed for student developer teams — where they can manage projects, write documentation, review code snippets, track tasks, and communicate — all in one place, with AI acting as a project assistant. "*

---

## 🛠️ Tech Stack

<div align="center">

### Frontend

| Technology | Version | Purpose |
|:---:|:---:|:---:|
| **React** | 18.3.1 | UI framework |
| **Vite** | 5.3.1 | Build tool & dev server |
| **Tailwind CSS** | 3.4.4 | Utility-first styling |
| **Framer Motion** | 11.2.10 | Animations & transitions |
| **React Router** | v7 | Client-side routing |
| **Socket.IO Client** | 4.8.3 | Real-time events |
| **Supabase JS** | 2.106.2 | Auth & database client |
| **Axios** | 1.6.6 | HTTP API requests |

### Backend

| Technology | Version | Purpose |
|:---:|:---:|:---:|
| **Node.js + Express** | 4.18.2 | REST API server |
| **Supabase (PostgreSQL)** | 2.106.2 | Database + Auth + Row Level Security |
| **Socket.IO** | 4.8.3 | Real-time bidirectional communication |
| **OpenAI / Groq SDK** | Latest | AI assistant, code review & whiteboard analysis |
| **Nodemailer** | 8.0.8 | Email delivery via SMTP |
| **Resend** | 6.12.4 | Transactional email service |
| **UUID** | 14.0.0 | Unique ID generation |

### Infrastructure & APIs

| Service | Role |
|:---:|:---:|
| **Supabase** | Auth (Email + Google OAuth), PostgreSQL, Realtime |
| **OpenAI API** | AI assistant, code reviewer, whiteboard analysis |
| **Vercel** | Frontend deployment |
| **Railway** | Backend deployment |
| **Gmail SMTP / Resend** | Email invitations & notifications |

</div>

---

## ⚙️ Local Setup

### Prerequisites

- Node.js v18+
- A [Supabase](https://supabase.com) project (free tier works)
- An OpenAI or Groq API key
- Git

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/shravanihaj74/DevCollab-Real-Time-Project-Collaboration-Platform-for-Developers.git
cd DevCollab-Real-Time-Project-Collaboration-Platform-for-Developers
```

### Step 2 — Set Up the Database

1. Open your [Supabase dashboard](https://app.supabase.com) → **SQL Editor**
2. Run `backend/database/schema.sql` to create all tables
3. Run `backend/database/auth-trigger.sql` to set up the auto-profile trigger on new user signup

### Step 3 — Configure & Start the Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `backend/.env`:

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_KEY=your_service_role_key_here
SUPABASE_ANON_KEY=your_anon_key_here
PORT=4000
CLIENT_URL=http://localhost:5173
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_16_char_app_password
EMAIL_FROM="DevCollab <your_email@gmail.com>"
OPENAI_API_KEY=sk-your_openai_api_key_here
```

```bash
npm run dev       # starts with nodemon on http://localhost:4000
```

### Step 4 — Configure & Start the Frontend

```bash
cd ../frontend
npm install
cp .env.example .env
```

Fill in `frontend/.env`:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_API_URL=http://localhost:4000/api
VITE_CLIENT_URL=http://localhost:5173
```

```bash
npm run dev       # starts on http://localhost:5173
```

### Step 5 — Google OAuth (Optional)

In Supabase → **Authentication → Providers → Google**, add your Client ID & Secret and set the redirect URL to `http://localhost:5173/auth/callback`.

---

## ✨ Features

<br/>

### 🏢 Workspace & Project Management

Create a **workspace** — your team's private hub. Inside each workspace, spin up as many **projects** as you need, each with its own isolated Kanban board, wiki, snippets, and members. Invite teammates by sending a secure email link; they land on a dedicated invite-accept page and join your workspace instantly. A **4-tier role system** (Owner → Admin → Member → Viewer) with a full permission matrix is available in Workspace Settings, giving owners granular control over who can create, edit, or only view content.

---

### 📋 Kanban Board

The core of sprint planning. Drag tasks across four clearly defined columns — **To Do → In Progress → In Review → Done** — and changes persist to the database in real time. Every task card shows what matters at a glance: **priority badge** (P0 critical / P1 high / P2 normal), **label** (Frontend, Backend, AI, Design, DevOps, Docs), **assignee avatar**, and **due date** with an automatic overdue highlight in red. Opening a task launches a **full detail modal** to edit every field, move it to any column, leave threaded comments, or delete it. Toggle between **Board view** and **List view** to suit your planning style.

---

### 💬 Comments & @Mentions

Every task has a built-in **comment thread** inside its detail modal. While typing, pressing `@` triggers an intelligent suggestion popup showing your workspace members — select a name to embed a formatted mention. The backend logs the comment to `task_comments`, fires a **persistent in-app notification** to the task creator and assignee, and records the action in the global Activity Feed so nothing goes unnoticed.

---

### 💻 Code Snippet Manager

A team library for reusable code. Each snippet stores a **title, programming language, description, comma-separated tags, and the full code block**. Browse the library with a **live search bar** (filters by title or tag simultaneously) or narrow by language. A one-click **Copy to Clipboard** button lives on every card. An **integrated AI reviewer** is available inline — paste code directly and receive a quality score and issue breakdown without leaving the page.

---

### 📄 Team Wiki

Each project ships with a dedicated **Wiki** — a multi-page documentation space for specs, onboarding guides, meeting notes, or architectural decisions. Pages are listed in a searchable sidebar; click any to load and edit in the panel. Every save increments the page's internal version counter, and content is stored back to Supabase. Teams can create as many pages as they need per project.

---

### 🤖 AI Project Assistant

A context-aware AI chatbot that has read your entire project before you say a word. It pulls live task data from Supabase as context before every query. Four **one-click prompt chips** address the most common team needs:

| Prompt | What it does |
|:---|:---|
| **Summarise this project** | Reads all task titles and statuses, returns a structured progress summary |
| **What's blocking us?** | Identifies tasks that have been in "In Progress" too long and flags blockers |
| **Generate standup report** | Produces a formatted daily standup based on task movement in the last 24 hours |
| **Break down a feature** | Describe a feature in plain English; AI generates up to 6 subtask cards with "Add to Kanban" |

Free-form chat is fully supported — ask anything about your project, your team's velocity, or next steps.

---

### 🔍 AI Code Reviewer

Paste any code snippet into the reviewer panel and receive a structured review in seconds: a **quality score from 1–10** plus individual issue cards categorised as `bug`, `performance`, `security`, or `style`. Each issue includes a concise title and an actionable suggestion for how to fix it. Powered by OpenAI/Groq with a strict JSON response schema so results are always consistently structured and developer-friendly.

---

### 📈 Activity Feed

A chronological **audit log** of every significant action across your workspace — tasks created and moved, comments added, docs updated, members joined, plans upgraded. Three independent **filter dropdowns** (project, member, action type) let you zero in on exactly what you need. Each entry shows the actor's avatar, a colour-coded action badge, a description, and a relative timestamp.

---

### 🔔 Real-Time Notifications

Powered by **Socket.IO** for instant push delivery and **Supabase Realtime** for persistence across sessions. The bell icon in the navbar shows an unread badge count at all times. The **Notification Panel** lists every alert — task assignments, comments on your tasks, workspace events — with per-item mark-as-read and a single mark-all-read button. Notifications survive page refreshes and reload from the database on every session start.

---

### 👥 Live Presence Indicators

The **PresenceBar** component on the Kanban board shows avatar bubbles for every teammate currently online in your workspace, updated in real time via Socket.IO's `online-users` broadcast. You always know who else is active and working alongside you.

---

### 👤 User Profiles

Each user maintains a profile with an **avatar** (auto-populated from Google OAuth or set manually), **full name**, **bio**, **skills tags**, and a **GitHub profile link**. All fields are editable from the Profile page and stored in the `profiles` table, linked to Supabase Auth.

---

### 💳 Payment Sandbox

A fully functional **Stripe-like payment flow** with zero real charges. Two pricing tiers — Free and Pro — with a monthly/yearly billing toggle (yearly saves 20%). The checkout modal accepts card details, validates them against a built-in sandbox registry that mirrors Stripe's test card behaviour (success, decline, insufficient funds, 3D Secure), generates a unique invoice ID, logs the transaction to the `transactions` table, and upgrades the workspace plan immediately.

---

## ⭐ Bonus Features

### 🎨 Collaborative Whiteboard 

A full freehand **drawing canvas** built directly into DevCollab — no third-party whiteboard tool needed. Draw system architecture diagrams, brainstorm flows, and sketch wireframes with adjustable brush sizes and colors. The board state is saved to the database per project so your diagrams persist across sessions.

The whiteboard goes further with **AI-powered diagram analysis** — click *"Analyse with AI"* and the current canvas is sent to OpenAI as an image. The AI returns a natural-language description of your diagram and can suggest actionable next steps. Those suggestions feed into an **"Add to Kanban"** button that converts the AI's output directly into task cards, bridging the gap between design and execution instantly.

---

### 📊 Dev Pulse — Team Health & Burnout Analytics ⭐ Bonus Feature

Most collaboration tools tell you *what* is happening. Dev Pulse tells you *how your team is holding up*. It's a real-time health dashboard that gives engineering leads early visibility into burnout risk before it becomes a problem.

For every workspace member, Dev Pulse calculates:

- **Burnout Risk Score (0–100%)** — computed from overdue tasks, high-priority task load, and open in-progress items
- **7-day velocity** — tasks completed in the last week
- **30-day velocity** — broader productivity trend
- **Sparkline activity chart** — visual trend of recent output
- **On-time completion rate** — percentage of tasks finished before their due date

A workspace summary header shows team-wide average burnout, total tasks completed, overdue count, and an overall mood indicator. Any member whose burnout score reaches **70% or above** triggers a prominent red alert card that recommends reassigning tasks — giving leads something specific to act on, not just a warning.

---


## 🌐 Live Deployment

<div align="center">

| | Service | Link |
|:---:|:---:|:---:|
| 🌐 | **Frontend (Vercel)** | [Frontend Link](https://dev-collab-real-time-project-collab.vercel.app/) |
| ⚙️ | **Backend (Render)** | [Backend Link](https://devcollab-real-time-project.onrender.com) |

</div>

---

## 👥 Meet the Team

<div align="center">

| Name | Role | GitHub |
|:---:|:---:|:---:|
| **Shravani Hajare** | Backend Engineer — REST API architecture, database schema, Supabase Auth, JWT middleware, workspace & task routes, email invitations, notifications | [@ShravaniHajare](https://github.com/shravanihaj74) |
| **Omkar Mohire** | AI Integration — OpenAI/Groq API, AI project assistant, AI code reviewer, whiteboard AI analysis, feature breakdown engine, project health service | [@OmkarMohire](https://github.com/omkarmohire22) |
| **Khushi Chile** | Frontend Developer — React UI components, all page layouts, Kanban board, snippets, wiki, activity feed, responsive design, Framer Motion animations | [@KhushiChile](https://github.com/khushi-io) |
| **Vinit Dalal** | Payments, Sandbox & DevOps — Stripe-like checkout sandbox, transaction logging, plan enforcement UI, Vercel + Render deployment, environment configuration | [@VinitDalal](https://github.com/vinitdalal05032004-bit) |

</div>

---

## 💳 Test Card Details

<div align="center">

The payment system is a **100% sandbox — no real charges, ever.**
Use any card below on the Plans & Billing page to test checkout flows.

> **Expiry:** any future date (e.g. `12/29`) &nbsp;·&nbsp; **CVV:** any 3 digits (e.g. `123`) &nbsp;·&nbsp; **Name:** anything

<br/>

| Card Number | Brand | Result |
|:---:|:---:|:---:|
| `4242 4242 4242 4242` | Visa | ✅ Payment succeeds |
| `4000 0565 6566 5556` | Visa Debit | ✅ Payment succeeds |
| `5555 5555 5555 4444` | Mastercard | ✅ Payment succeeds |
| `3782 8224 6310 005` | American Express | ✅ Payment succeeds |
| `6011 1111 1111 1117` | Discover | ✅ Payment succeeds |
| `4000 0000 0000 0002` | Visa | ❌ Card declined |
| `4000 0000 0000 9995` | Visa | ❌ Insufficient funds |
| `4000 0000 0000 3220` | Visa | 🔐 3D Secure authentication required |

</div>

---

## ⚠️ Known Limitations

- **Calendar view** — Task views are Board and List only; calendar view is not yet implemented
- **Wiki rich-text editor** — Currently a plain textarea; Tiptap/Quill integration is planned
- **Wiki page linking** — Inter-page `[[links]]` are not yet supported
- **Whiteboard multi-user live sync** — Canvas state persists per project but real-time cursor sync between simultaneous users is not yet implemented
- **Mobile responsiveness** — Kanban and Whiteboard pages are optimised for desktop screens

---

<div align="center">

Built by Bug Smashers for **DevFusion: The Developers Hackathon 2.0**

*Powered by Supabase · Socket.IO · Vercel · Render*

</div>
