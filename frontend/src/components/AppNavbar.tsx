import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BookOpen, Library, LayoutDashboard, History, Flame, Menu, LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
const AppNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    userProgress,
    user,
    logout
  } = useStore();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isActive = (path: string) => location.pathname === path;
  const navLinks = [{
    path: '/app/dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard
  }, {
    path: '/app/wordlist',
    label: 'Wordlist',
    icon: Library
  }, {
    path: '/app/flashcards',
    label: 'Flashcards',
    icon: BookOpen
  }, {
    path: '/app/history',
    label: 'History',
    icon: History
  }];
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  return <nav className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo - Navigate to Home */}
          <button onClick={() => navigate('/')} className="flex items-center gap-2 group cursor-pointer">
            <div className="w-10 h-10 rounded-xl bg-gradient-hero flex items-center justify-center shadow-glow transition-transform group-hover:scale-110">
              <span className="text-2xl font-bold japanese-text text-[#f43a09]">日</span>
            </div>
            <span className="hidden sm:block text-xl font-bold font-heading bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              NihonLab
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navLinks.map(link => {
            const Icon = link.icon;
            return <Link key={link.path} to={link.path} className="relative group">
                  <div className={`flex items-center gap-2 font-medium transition-colors ${isActive(link.path) ? 'text-primary' : 'text-foreground hover:text-primary'}`}>
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {isActive(link.path) && <motion.div layoutId="activeTab" className="absolute -bottom-3 left-0 right-0 h-0.5 bg-primary" initial={false} transition={{
                type: 'spring',
                stiffness: 380,
                damping: 30
              }} />}
                </Link>;
          })}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Streak Counter */}
            <div className="flex items-center gap-2 bg-muted px-3 py-1.5 rounded-full">
              <Flame className="w-4 h-4 text-primary glow-pulse" />
              <span className="font-bold text-sm">{userProgress.streak}</span>
            </div>

            {/* User Avatar Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full overflow-hidden ring-2 ring-primary/20 hover:ring-primary/40 transition-all">
                  {user?.avatarUrl ? <img src={user.avatarUrl} alt={user.name} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gradient-hero flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/app/dashboard')}>
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col gap-4 mt-8">
                  {navLinks.map(link => {
                  const Icon = link.icon;
                  return <Link key={link.path} to={link.path} onClick={() => setMobileOpen(false)} className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isActive(link.path) ? 'bg-primary/10 text-primary' : 'hover:bg-muted'}`}>
                        <Icon className="w-5 h-5" />
                        <span className="font-medium">{link.label}</span>
                      </Link>;
                })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>;
};
export default AppNavbar;