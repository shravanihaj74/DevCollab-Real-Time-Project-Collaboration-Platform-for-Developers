import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import DashboardPage from "./pages/DashboardPage";
import KanbanPage from "./pages/KanbanPage";
import SnippetsPage from "./pages/SnippetsPage";
import WikiPage from "./pages/WikiPage";
import AIAssistantPage from "./pages/AIAssistantPage";
import DevPulsePage from "./pages/DevPulsePage";
import ActivityPage from "./pages/ActivityPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/kanban" element={<KanbanPage />} />
        <Route path="/snippets" element={<SnippetsPage />} />
        <Route path="/wiki" element={<WikiPage />} />
        <Route path="/ai" element={<AIAssistantPage />} />
        <Route path="/pulse" element={<DevPulsePage />} />
        <Route path="/activity" element={<ActivityPage />} />
      </Routes>
    </BrowserRouter>
  );
}
