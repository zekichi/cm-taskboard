import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "@/components/Layout";
import LoadingState from "@/components/feedback/LoadingState";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import PageNotFound from "@/lib/PageNotFound";
import { queryClientInstance } from "@/lib/query-client";
import { WorkspaceProvider } from "@/lib/WorkspaceContext";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Workspace from "@/pages/Workspace";
import TaskBoard from "@/pages/TaskBoard";
import TaskList from "@/pages/TaskList";

const AuthenticatedApp = () => {
  const { loading, isAuthenticated } = useAuth();

  if (loading) {
    return <LoadingState label="Validando sesión..." />;
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <WorkspaceProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/board" element={<TaskBoard />} />
          <Route path="/tasks" element={<TaskList />} />
          <Route path="/workspace" element={<Workspace />} />
          <Route path="*" element={<PageNotFound />} />
        </Route>
      </Routes>
    </WorkspaceProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;
