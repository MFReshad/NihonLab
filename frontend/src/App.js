import React, { useState } from 'react';
import { ChevronRight, Play, X } from 'lucide-react';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [hoveredVideo, setHoveredVideo] = useState(null);

  const handleSignUp = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentPage('feed');
    console.log('Sign up data:', userData);
  };

  const handleLogin = (credentials) => {
    setUser({ email: credentials.email });
    setIsLoggedIn(true);
    setCurrentPage('feed');
    console.log('Login data:', credentials);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentPage('home');
  };

  if (currentPage === 'signup') {
    return <SignUpPage onSignUp={handleSignUp} onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleLogin} onBack={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'feed' && isLoggedIn) {
    return <LearningFeedPage user={user} onLogout={handleLogout} hoveredVideo={hoveredVideo} setHoveredVideo={setHoveredVideo} />;
  }

  return (
    <HomePage
      onSignUpClick={() => setCurrentPage('signup')}
      onLoginClick={() => setCurrentPage('login')}
    />
  );
}

function HomePage({ onSignUpClick, onLoginClick }) {
  const [hoveredVideoSection, setHoveredVideoSection] = useState(null);
  
  return (
    <div className="min-h-screen bg-white">
      <nav className="flex justify-between items-center p-6 max-w-6xl mx-auto">
        <div className="text-3xl font-bold text-blue-600">NihonLab</div>
        <div className="space-x-4">
          <button
            onClick={onLoginClick}
            className="px-6 py-2 text-gray-700 hover:text-blue-600 transition"
          >
            Log In
          </button>
          <button
            onClick={onSignUpClick}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-gray-900">
            Level Up Your Vocabulary with AI
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Chat with AI, answer an infinite feed of questions, and watch your vocabulary explode.
            The smartest way to learn new words.
          </p>
          <button
            onClick={onSignUpClick}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition inline-flex items-center gap-2"
          >
            Get Started <ChevronRight size={20} />
          </button>
        </div>

        {/* Infinite Learning Feed Section with Video */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Infinite Learning Feed</h2>
          <p className="text-lg text-gray-600 mb-8">
            Never run out of words to learn with our adaptive feed. Get personalized questions, track your streaks, and watch your points grow as you master new vocabulary.
          </p>
          
          <div 
            className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer bg-black"
            onMouseEnter={() => setHoveredVideoSection('feed')}
            onMouseLeave={() => setHoveredVideoSection(null)}
          >
            <video
              className="w-full h-96 object-cover"
              autoPlay={hoveredVideoSection === 'feed'}
              loop
              muted
              playsInline
            >
              <source src="/videos/learning-feed-demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {hoveredVideoSection !== 'feed' && (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-white bg-opacity-20 p-6 rounded-full inline-block mb-4">
                    <Play size={48} className="text-white" />
                  </div>
                  <p className="text-white text-xl font-semibold">Interactive Learning Feed Demo</p>
                  <p className="text-white text-sm mt-2">Hover to preview</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Watch How It Works Section with Video */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">Watch How It Works</h2>
          
          <div 
            className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer mb-8"
            onMouseEnter={() => setHoveredVideoSection('tutorial')}
            onMouseLeave={() => setHoveredVideoSection(null)}
          >
            <img
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop"
              alt="Quick Start Guide"
              className="w-full h-96 object-cover"
            />
            {hoveredVideoSection === 'tutorial' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-blue-600 p-6 rounded-full inline-block mb-4 animate-pulse">
                    <Play size={48} className="text-white fill-white" />
                  </div>
                  <p className="text-white text-xl font-semibold">Quick Start Guide</p>
                  <p className="text-white text-sm mt-2">Learn the basics in 2 minutes</p>
                </div>
              </div>
            )}
          </div>

          <div 
            className="relative rounded-xl overflow-hidden shadow-2xl cursor-pointer"
            onMouseEnter={() => setHoveredVideoSection('advanced')}
            onMouseLeave={() => setHoveredVideoSection(null)}
          >
            <img
              src="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=1200&h=600&fit=crop"
              alt="Master AI Features"
              className="w-full h-96 object-cover"
            />
            {hoveredVideoSection === 'advanced' && (
              <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                <div className="text-center">
                  <div className="bg-blue-600 p-6 rounded-full inline-block mb-4 animate-pulse">
                    <Play size={48} className="text-white fill-white" />
                  </div>
                  <p className="text-white text-xl font-semibold">Master AI Features</p>
                  <p className="text-white text-sm mt-2">Advanced tips and tricks</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-20">

          <FeatureCard
            title="Custom Categories"
            description="Organize your vocabulary learning by creating custom categories. Group words by topic, difficulty, or any way that helps you learn better."
            image="https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=400&h=300&fit=crop"
          />

          <FeatureCard
            title="AI Chat Assistant"
            description="Get instant help with our AI chat assistant. Use @ commands to explore words in depth, from definitions to usage examples and practice exercises."
            image="https://images.unsplash.com/photo-1531746790731-6c087fecd65a?w=400&h=300&fit=crop"
          />
        </div>

        <div className="text-center mt-20 bg-blue-50 rounded-xl p-12">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Vocabulary?</h2>
          <p className="text-gray-600 mb-6">
            Join thousands of learners who are improving their language skills with NihonLab.
          </p>
          <button
            onClick={onSignUpClick}
            className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition"
          >
            Start Learning Today
          </button>
        </div>
      </section>

      <footer className="bg-gray-100 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© 2025 NihonLab. All rights reserved.Done by Aishik & Reshad</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, image, hasVideo }) {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <div 
      className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          className="w-full h-48 object-cover"
        />
        {hasVideo && isHovered && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-blue-600 p-4 rounded-full animate-pulse">
              <Play size={32} className="text-white fill-white" />
            </div>
          </div>
        )}
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function SignUpPage({ onSignUp, onBack }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.name || !formData.email || !formData.password) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    onSignUp(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">NihonLab</h1>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2">Create Account</h2>
        <p className="text-gray-600 mb-6">Join NihonLab and start learning today</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
          >
            Create Account
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{' '}
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold hover:underline"
          >
            Log In
          </button>
        </p>
      </div>
    </div>
  );
}

function LoginPage({ onLogin, onBack }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!formData.email || !formData.password) {
      setError('Email and password are required');
      return;
    }

    onLogin(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-blue-600">NihonLab</h1>
          <button
            onClick={onBack}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X size={24} />
          </button>
        </div>

        <h2 className="text-2xl font-bold mb-2">Welcome Back</h2>
        <p className="text-gray-600 mb-6">Log in to your account</p>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mt-6"
          >
            Log In
          </button>
        </div>

        <p className="text-center text-gray-600 mt-6">
          Don't have an account?{' '}
          <button
            onClick={onBack}
            className="text-blue-600 font-semibold hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}

function LearningFeedPage({ user, onLogout, hoveredVideo, setHoveredVideo }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState(['All', 'Business', 'Daily Life', 'Technology']);
  const [newCategory, setNewCategory] = useState('');
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const videos = [
    { id: 1, title: 'Word Origins', category: 'Business', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=400&h=300&fit=crop' },
    { id: 2, title: 'Pronunciation Guide', category: 'Daily Life', image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop' },
    { id: 3, title: 'Business Vocabulary', category: 'Business', image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop' },
    { id: 4, title: 'Tech Terms', category: 'Technology', image: 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop' },
  ];

  const questions = [
    { id: 1, text: 'What does "ephemeral" mean?', points: 10, category: 'Daily Life' },
    { id: 2, text: 'Complete: "The meeting was____"', points: 15, category: 'Business' },
    { id: 3, text: 'Which is the correct usage?', points: 10, category: 'Technology' },
  ];

  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
      setNewCategory('');
      setShowCategoryForm(false);
    }
  };

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  const filteredQuestions = selectedCategory === 'All'
    ? questions
    : questions.filter(q => q.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">NihonLab</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-700">Welcome, {user?.name || user?.email}</span>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
            >
              Log Out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Learning Categories</h2>
            <button
              onClick={() => setShowCategoryForm(!showCategoryForm)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              + Add Category
            </button>
          </div>

          {showCategoryForm && (
            <div className="bg-white p-4 rounded-lg mb-6 shadow-sm">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  placeholder="Enter category name"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddCategory}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  Add
                </button>
                <button
                  onClick={() => setShowCategoryForm(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full font-semibold transition ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 border border-gray-300 hover:border-blue-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <section className="mb-16">
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Video Learning</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                onMouseEnter={() => setHoveredVideo(video.id)}
                onMouseLeave={() => setHoveredVideo(null)}
                className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer group"
              >
                <div className="relative h-40 overflow-hidden bg-gray-200">
                  <img
                    src={video.image}
                    alt={video.title}
                    className="w-full h-full object-cover"
                  />
                  {hoveredVideo === video.id && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="bg-blue-600 p-3 rounded-full">
                        <Play size={24} className="text-white fill-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
                    {video.category}
                  </p>
                  <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition">
                    {video.title}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-8 text-gray-900">Infinite Learning Feed</h2>
          <div className="space-y-4">
            {filteredQuestions.map(q => (
              <div
                key={q.id}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition cursor-pointer group"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <p className="text-xs font-semibold text-blue-600 uppercase mb-2">
                      {q.category}
                    </p>
                    <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition">
                      {q.text}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                      +{q.points} pts
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}