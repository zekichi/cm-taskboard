import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Layout from "@/components/Layout";
import LoadingState from "@/components/feedback/LoadingState";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider, useAuth } from "@/lib/AuthContext";
import PageNotFound from "@/lib/PageNotFound";
import { queryClientInstance } from "@/lib/query-client";
import Dashboard from "@/pages/Dashboard";
import TaskBoard from "@/pages/TaskBoard";
import TaskList from "@/pages/TaskList";

const AuthenticatedApp = () => {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingState label="Validando sesión..." />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/board" element={<TaskBoard />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
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
