<div align="center">

<br />

```
██████╗ ███████╗██╗   ██╗ ██████╗ ██████╗ ██╗     ██╗      █████╗ ██████╗ 
██╔══██╗██╔════╝██║   ██║██╔════╝██╔═══██╗██║     ██║     ██╔══██╗██╔══██╗
██║  ██║█████╗  ██║   ██║██║     ██║   ██║██║     ██║     ███████║██████╔╝
██║  ██║██╔══╝  ╚██╗ ██╔╝██║     ██║   ██║██║     ██║     ██╔══██║██╔══██╗
██████╔╝███████╗ ╚████╔╝ ╚██████╗╚██████╔╝███████╗███████╗██║  ██║██████╔╝
╚═════╝ ╚══════╝  ╚═══╝   ╚═════╝ ╚═════╝ ╚══════╝╚══════╝╚═╝  ╚═╝╚═════╝ 
```

### **The all-in-one collaboration platform built for developer teams.**  
*GitHub × Notion × Slack — unified, intelligent, real-time.*

<br />

[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-11.2-FF0055?style=for-the-badge&logo=framer&logoColor=white)](https://www.framer.com/motion)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<br />

> 🏆 **DevFusion: The Developers Hackathon 2.0**  
> Problem Statement: **DevCollab — Real-Time Project Collaboration Platform for Developers**

<br />

</div>

---

## 🧭 Table of Contents

- [The Vision](#-the-vision)
- [What It Does](#-what-it-does)
- [Tech Stack](#-tech-stack)
- [Features Built](#-features-built)
- [Screenshots](#-screenshots)
- [Run Locally](#-run-locally)
- [Live Demo](#-live-demo)
- [Team](#-team)
- [Known Limitations](#-known-limitations)

---

## 🌟 The Vision

Student developer teams work across too many tools — GitHub for code, Notion for docs, Slack for chat, Jira for tasks. Context switching kills productivity and fragments collaboration.

**DevCollab** brings it all together into a single, beautiful workspace: manage tasks on a Kanban board, save reusable code snippets, collaborate on a wiki, get an AI project assistant, and watch your team's pulse — all in real time.

---

## 💡 What It Does

DevCollab is a full-featured developer collaboration platform where teams can:

- **Create workspaces** with multiple projects, roles (Owner / Admin / Member / Viewer), and member management
- **Track tasks** on a drag-and-drop Kanban board with priorities, labels, assignees, due dates, attachments, and @mention comments
- **Collaborate in real time** with live presence indicators, board-sync events, and instant notifications — powered by simulated Socket.IO
- **Store and share code snippets** with syntax highlighting, tag search, and one-click copy
- **Write and link documentation** in a rich wiki with page linking and version history
- **Chat with an AI Project Assistant** for progress summaries, blocker detection, standup reports, and automated task breakdowns
- **Sketch and analyse architecture** on an interactive whiteboard — the "wow factor" AI Pair Planning canvas
- **Monitor team health** with Dev Pulse: burnout alerts, mood check-ins, sparkline charts, and AI weekly digest
- **Track every action** in a global Activity Feed
- **Upgrade via a payments page** (Free / Pro sandbox checkout)

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Frontend Framework** | React 18.3 + Vite 5.3 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 11.2 |
| **Routing** | React Router DOM 7 |
| **State Management** | React Context API (AuthContext + RealtimeContext) |
| **Real-Time Layer** | Simulated Socket.IO event engine (RealtimeContext) |
| **AI Features** | Hardcoded AI response engine (demo-ready; swap in Claude / OpenAI API) |
| **Build Tool** | Vite with PostCSS + Autoprefixer |
| **Canvas / Whiteboard** | HTML5 Canvas API |
| **Syntax Highlighting** | Custom keyword-based tokeniser (no external lib) |

> **No backend or database is required to run the project.** All state is managed in-memory via React Context, making it instantly runnable for demo purposes.

---

## ✅ Features Built

### 🏢 Workspace & Projects
- [x] Create a workspace with a name, description, and tech stack tags
- [x] Multi-project support inside each workspace
- [x] Role system: Owner, Admin, Member, Viewer (UI enforced)
- [x] Member invite flow with email input
- [x] Workspace settings page (name, danger zone, member management)

### 📋 Task Management (Kanban)
- [x] Four-column Kanban board: **To Do → In Progress → In Review → Done**
- [x] Drag-and-drop task cards across columns (HTML5 DnD + Framer Motion)
- [x] Task modal: title, description, assignee, priority (P0 / P1 / P2), due date, labels, attachments
- [x] Task comments with @mention support
- [x] Overdue task highlighting
- [x] Column card counters and colour-coded column headers

### 🔴 Real-Time Collaboration
- [x] Simulated Socket.IO event engine with scripted remote user events
- [x] Live presence bar: shows who is online and what they are viewing
- [x] Task-level viewers: "Riya is viewing this task"
- [x] Real-time notification toasts: task moved, comment added, task assigned
- [x] Notification centre panel with full history

### 💻 Code Snippet Manager
- [x] Save snippets with title, language, tags, and description
- [x] Syntax-highlighted display (JS, TS, Python, Java, C++, Go)
- [x] Search by title or tag
- [x] Copy to clipboard button
- [x] AI Code Reviewer: paste any snippet → get a quality score (1–10), bugs, performance issues, readability and security suggestions

### 📖 Documentation Wiki
- [x] Project wiki with multiple pages
- [x] Rich-text-style editor with headings, bullets, code blocks
- [x] Page linking and navigation
- [x] Version history view

### 🤖 AI Project Assistant
- [x] **"Summarise this project"** — sprint progress summary with velocity
- [x] **"What's blocking us?"** — identifies stale In Progress tasks and suggested actions
- [x] **"Generate standup report"** — daily standup in structured format
- [x] **"Break down a feature"** — auto-generates subtasks from a plain-English description (e.g. "Build a login system" → 6 Kanban-ready tasks)
- [x] Chat-style UI with typing animation and message history

### 🎨 AI Pair Planning (Whiteboard) ⭐ *Wow-Factor Feature*
- [x] Freehand canvas with Pen, Marker, Rectangle, Circle, Arrow, Text, and Eraser tools
- [x] Colour palette and stroke-size picker
- [x] Undo / Clear / Export (PNG download)
- [x] **"AI Analyse" button** — reads the canvas and returns: architecture title, description, improvement suggestions, and auto-generated Kanban tasks
- [x] Animated AI analysis result panel with task list

### 📊 Dev Pulse — Team Health Dashboard ⭐ *Wow-Factor Feature*
- [x] Per-member burnout risk bar (colour-coded: green / amber / red)
- [x] Daily mood check-ins (emoji selector)
- [x] Activity sparklines per member (7-day trend)
- [x] Overdue task count and completion rate
- [x] **"Generate Weekly Digest"** — AI-written team summary
- [x] Overdue and burnout alerts in a notifications strip

### 📡 Activity Feed
- [x] Global workspace feed: task moved, comment added, doc updated, member joined
- [x] Filter by project or member
- [x] Event type icons and relative timestamps

### 👤 User System
- [x] Sign in / Sign up modal (accepts any credentials for demo)
- [x] Profile page with avatar, bio, skills, and GitHub link
- [x] Notification centre with in-app alert history

### 💳 Payments
- [x] Free plan: 1 workspace, 3 projects, 5 members
- [x] Pro plan: unlimited everything + AI features ($12/user/month)
- [x] Sandbox checkout flow

---

## 🖥 Run Locally

Follow these steps to get DevCollab running on your machine in under 2 minutes.

### Prerequisites

- **Node.js** v18 or higher — [Download here](https://nodejs.org)
- **npm** v9 or higher (comes with Node)

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/your-team/devcollab.git
cd devcollab

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Then open your browser at **http://localhost:5173**

### Login

The app uses a simulated auth system — enter **any email and password** to sign in. No backend required.

### Build for Production

```bash
npm run build       # outputs to /dist
npm run preview     # preview the production build locally
```

> ℹ️ The project is entirely frontend — no `.env` file, no API keys, no database setup needed for the demo.

---

## 🌐 Live Demo

> 🔗 **[https://devcollab.vercel.app](https://devcollab.vercel.app)**  
> *(Replace with your actual deployment URL)*

Deployed on **Vercel** — CI/CD from the main branch.

---

## 👥 Team

| Name | Role | GitHub |
|---|---|---|
| **Rahul Kumar** | Full-Stack Lead & Architecture | [@rahulkumar](https://github.com) |
| **Ankush Sharma** | Frontend Lead — Kanban, Whiteboard, Animations | [@ankushsharma](https://github.com) |
| **Riya Mehta** | Backend & AI Integration — Context, AI pages | [@riyamehta](https://github.com) |
| **Sneha Patil** | UI/UX Design — Component library, Design system | [@snehapatil](https://github.com) |
| **Dev Joshi** | DevOps & Tooling — Vite config, build, deploy | [@devjoshi](https://github.com) |

> ✏️ *Update names, roles, and GitHub links to match your actual team.*

---

## 🐛 Known Bugs & Limitations

We believe in transparency — here's what we know:

| Issue | Details |
|---|---|
| **No real backend** | All data lives in React state and resets on page refresh. A production version would use Node.js + PostgreSQL + Socket.IO. |
| **AI responses are hardcoded** | The AI Assistant and Code Reviewer return scripted responses keyed to specific inputs. Integrating a live LLM (Claude, GPT-4) is the natural next step. |
| **No real Socket.IO** | Real-time collaboration is simulated via scripted setTimeout events. True multi-user sync requires a WebSocket server. |
| **Auth is mock** | Any non-empty email/password logs you in. No real JWT, sessions, or security. |
| **Whiteboard AI is simulated** | The "AI Analyse" button cycles through preset analysis responses rather than reading actual canvas pixels via a vision model. |
| **Wiki editor is basic** | The rich-text editor is a custom textarea — no true block editor (like Tiptap or Lexical) is wired up. |
| **No file uploads** | Attachment names are stored as strings. Actual file upload/storage (S3, Cloudinary) is not implemented. |
| **Payments are sandbox** | The checkout flow is a UI demo — no Stripe or Razorpay integration is live. |
| **Mobile responsiveness** | The app is optimised for desktop (≥1024px). Some pages may overflow on small screens. |

---

## 🗺 What's Next (Post-Hackathon Roadmap)

- [ ] Real Node.js + Express backend with PostgreSQL
- [ ] Socket.IO for true multi-user real-time sync
- [ ] Live Claude / GPT-4 Vision integration for Whiteboard AI Analyse
- [ ] Tiptap rich-text editor for the Wiki
- [ ] GitHub OAuth login
- [ ] Stripe payment integration
- [ ] Mobile-responsive redesign
- [ ] End-to-end tests with Playwright

---

<div align="center">

<br />

**Built with ❤️ in 24 hours at DevFusion: The Developers Hackathon 2.0**

*If you found this project useful or interesting, please consider giving it a ⭐ on GitHub!*

<br />

</div>
