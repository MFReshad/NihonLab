import React, { useState } from 'react';
import { ChevronRight, Play } from 'lucide-react';

function HomePage({ onSignUpClick, onLoginClick, onGetStartedClick }) {
  const [hoveredVideoSection, setHoveredVideoSection] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
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

      {/* Hero Section */}
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
            onClick={onGetStartedClick}
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

        {/* CTA Section */}
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

      {/* Footer */}
      <footer className="bg-gray-100 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-6 text-center text-gray-600">
          <p>© 2024 NihonLab. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ title, description, image }) {
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
      </div>
      <div className="p-6">
        <h3 className="text-2xl font-bold mb-3 text-gray-900">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

export default HomePage;