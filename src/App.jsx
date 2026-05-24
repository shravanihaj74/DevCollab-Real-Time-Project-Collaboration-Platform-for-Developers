import { BrowserRouter, Routes, Route } from "react-router-dom";
import { RealtimeProvider }       from "./context/RealtimeContext";
import { AuthProvider }           from "./context/AuthContext";
import NotificationToast          from "./components/NotificationToast";
import LandingPage                from "./pages/LandingPage";
import DashboardPage              from "./pages/DashboardPage";
import KanbanPage                 from "./pages/KanbanPage";
import SnippetsPage               from "./pages/SnippetsPage";
import WikiPage                   from "./pages/WikiPage";
import AIAssistantPage            from "./pages/AIAssistantPage";
import DevPulsePage               from "./pages/DevPulsePage";
import ActivityPage               from "./pages/ActivityPage";
import CreateWorkspacePage        from "./pages/CreateWorkspacePage";
import WorkspaceSettingsPage      from "./pages/WorkspaceSettingsPage";
import NewProjectPage             from "./pages/NewProjectPage";
import ProfilePage                from "./pages/ProfilePage";
import PaymentsPage               from "./pages/PaymentsPage";
import WhiteboardPage             from "./pages/WhiteboardPage";

export default function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <BrowserRouter>
          <NotificationToast />
        <Routes>
          <Route path="/"                   element={<LandingPage />} />
          <Route path="/create-workspace"   element={<CreateWorkspacePage />} />
          <Route path="/new-project"        element={<NewProjectPage />} />
          <Route path="/dashboard"          element={<DashboardPage />} />
          <Route path="/kanban"             element={<KanbanPage />} />
          <Route path="/snippets"           element={<SnippetsPage />} />
          <Route path="/wiki"               element={<WikiPage />} />
          <Route path="/ai"                 element={<AIAssistantPage />} />
          <Route path="/pulse"              element={<DevPulsePage />} />
          <Route path="/activity"           element={<ActivityPage />} />
          <Route path="/workspace/settings" element={<WorkspaceSettingsPage />} />
          <Route path="/profile"            element={<ProfilePage />} />
          <Route path="/payments"           element={<PaymentsPage />} />
          <Route path="/whiteboard"         element={<WhiteboardPage />} />
        </Routes>
        </BrowserRouter>
      </RealtimeProvider>
    </AuthProvider>
  );
}
