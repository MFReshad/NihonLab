import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useStore } from "@/store/useStore";
import Landing from "./pages/Landing";
import Auth from "./pages/Auth";
import AppLayout from "./pages/AppLayout";
import Dashboard from "./pages/Dashboard";
import Wordlist from "./pages/Wordlist";
import Flashcards from "./pages/Flashcards";
import LearningHistory from "./pages/LearningHistory";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => {
  const { isAuthenticated } = useStore();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public pages */}
            <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Landing />} />
            <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Auth />} />

            {/* Protected pages */}
            <Route element={<AppLayout />}>
              <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="wordlist" element={<ProtectedRoute><Wordlist /></ProtectedRoute>} />
              <Route path="flashcards" element={<ProtectedRoute><Flashcards /></ProtectedRoute>} />
              <Route path="history" element={<ProtectedRoute><LearningHistory /></ProtectedRoute>} />
            </Route>

            {/* Not found */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
