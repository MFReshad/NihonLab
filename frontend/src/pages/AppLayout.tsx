import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import AppNavbar from '@/components/AppNavbar';
import AIChatModal from '@/components/AIChatModal';

const AppLayout = () => {
  const navigate = useNavigate();
  const { isAuthenticated, updateStreak } = useStore();
  const [isChatOpen, setIsChatOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    } else {
      updateStreak();
    }
  }, [isAuthenticated, navigate, updateStreak]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen gradient-bg">
      <AppNavbar />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>

      {/* Floating AI Chat Button */}
      <button
        onClick={() => setIsChatOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-hero text-white rounded-full shadow-glow flex items-center justify-center hover:scale-110 transition-all duration-300 z-40 animate-pulse"
        aria-label="Open AI Chat"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      <AIChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
};

export default AppLayout;
