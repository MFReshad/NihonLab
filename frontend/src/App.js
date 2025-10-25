import React, { useState } from 'react';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import FeedPage from './pages/FeedPage';
import WordlistsPage from './pages/WordlistsPage';
import HistoryPage from './pages/HistoryPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  const handleSignUp = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('feed');  // Go to Feed page after signup
    console.log('Sign up data:', userData);
  };

  const handleLogin = (credentials) => {
    setUser({ email: credentials.email });
    setIsLoggedIn(true);
    setCurrentPage('feed');  // Go to Feed page after login
    console.log('Login data:', credentials);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  const handleGetStarted = () => {
    if (isLoggedIn) {
      setCurrentPage('feed');
    } else {
      setCurrentPage('signup');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  // Public pages (before login)
  if (!isLoggedIn) {
    if (currentPage === 'signup') {
      return <SignUpPage onSignUp={handleSignUp} onBack={() => setCurrentPage('home')} />;
    }

    if (currentPage === 'login') {
      return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('home')} />;
    }

    return (
      <HomePage
        onSignUpClick={() => setCurrentPage('signup')}
        onLoginClick={() => setCurrentPage('login')}
        onGetStartedClick={handleGetStarted}
      />
    );
  }

  // Protected pages (after login) - All use Navbar
  if (currentPage === 'dashboard') {
    return (
      <DashboardPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    );
  }

  if (currentPage === 'feed') {
    return (
      <FeedPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    );
  }

  if (currentPage === 'wordlists') {
    return (
      <WordlistsPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    );
  }

  if (currentPage === 'history') {
    return (
      <HistoryPage
        user={user}
        onLogout={handleLogout}
        onNavigate={handleNavigate}
        currentPage={currentPage}
      />
    );
  }

  // Default: go to feed page
  return (
    <FeedPage
      user={user}
      onLogout={handleLogout}
      onNavigate={handleNavigate}
      currentPage="feed"
    />
  );
}