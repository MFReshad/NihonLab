import React, { useState } from 'react';
import { Play, Trophy, Flame, Check } from 'lucide-react';
import Navbar from '../components/Navbar';

function FeedPage({ user, onLogout, onNavigate, currentPage }) {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(5);

  const categories = ['All', 'Business', 'Daily Life', 'Technology', 'Travel'];

  const questions = [
    {
      id: 1,
      word: 'Ephemeral',
      question: 'What does "ephemeral" mean?',
      options: [
        'Lasting for a very short time',
        'Extremely beautiful',
        'Very old',
        'Difficult to understand'
      ],
      correct: 0,
      category: 'Daily Life',
      points: 10,
    },
    {
      id: 2,
      word: 'Pragmatic',
      question: 'Choose the correct meaning of "pragmatic":',
      options: [
        'Dealing with things sensibly and realistically',
        'Very artistic',
        'Full of energy',
        'Extremely lazy'
      ],
      correct: 0,
      category: 'Business',
      points: 15,
    },
    {
      id: 3,
      word: 'Algorithm',
      question: 'What is an algorithm?',
      options: [
        'A type of music',
        'A step-by-step procedure for calculations',
        'A mathematical formula',
        'A computer program'
      ],
      correct: 1,
      category: 'Technology',
      points: 10,
    },
  ];

  const videos = [
    {
      id: 1,
      title: 'Master Business Vocabulary',
      category: 'Business',
      duration: '5:30',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: 'Travel Phrases Guide',
      category: 'Travel',
      duration: '8:15',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: 'Tech Terms Explained',
      category: 'Technology',
      duration: '6:45',
      image: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: 'Daily Conversation',
      category: 'Daily Life',
      duration: '4:20',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop'
    },
  ];

  const handleAnswer = (selectedIndex) => {
    if (selectedIndex === questions[currentQuestion].correct) {
      setScore(score + questions[currentQuestion].points);
      setStreak(streak + 1);
    } else {
      setStreak(0);
    }
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setCurrentQuestion(0);
    }
  };

  const filteredQuestions = selectedCategory === 'All' 
    ? questions 
    : questions.filter(q => q.category === selectedCategory);

  const filteredVideos = selectedCategory === 'All'
    ? videos
    : videos.filter(v => v.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
     <Navbar 
  currentPage={currentPage}
  onNavigate={onNavigate}
  user={user}
  onLogout={onLogout}
/>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Categories */}
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-900">Categories</h2>
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

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Question Card */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <span className="text-xs font-semibold text-blue-600 uppercase">
                    {questions[currentQuestion].category}
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900 mt-1">
                    {questions[currentQuestion].word}
                  </h3>
                </div>
                <div className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold">
                  +{questions[currentQuestion].points} pts
                </div>
              </div>

              <p className="text-lg text-gray-700 mb-6">
                {questions[currentQuestion].question}
              </p>

              <div className="space-y-3">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full text-left px-6 py-4 bg-gray-50 hover:bg-blue-50 border-2 border-gray-200 hover:border-blue-400 rounded-lg transition font-medium text-gray-800"
                  >
                    {option}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-gray-500">
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <button className="text-blue-600 font-semibold hover:underline">
                  Skip →
                </button>
              </div>
            </div>

            {/* Video Learning Section */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Video Lessons</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {filteredVideos.map(video => (
                  <div
                    key={video.id}
                    onMouseEnter={() => setHoveredVideo(video.id)}
                    onMouseLeave={() => setHoveredVideo(null)}
                    className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition cursor-pointer group"
                  >
                    <div className="relative h-48 overflow-hidden bg-gray-200">
                      <img
                        src={video.image}
                        alt={video.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                      {hoveredVideo === video.id && (
                        <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                          <div className="bg-blue-600 p-3 rounded-full">
                            <Play size={32} className="text-white fill-white" />
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
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Progress Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Today's Progress</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Words Learned</span>
                    <span className="font-bold text-gray-900">12/20</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-600">Daily Goal</span>
                    <span className="font-bold text-gray-900">8/10 min</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Check className="text-green-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Mastered "Ephemeral"</p>
                    <p className="text-xs text-gray-500">2 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <Trophy className="text-blue-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">Earned 50 points</p>
                    <p className="text-xs text-gray-500">1 hour ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                    <Flame className="text-orange-600" size={16} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-900">5-day streak!</p>
                    <p className="text-xs text-gray-500">Today</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">🎯 Next Milestone</h3>
              <p className="text-sm mb-3 opacity-90">Learn 50 more words to unlock "Vocabulary Master" badge</p>
              <div className="w-full bg-white bg-opacity-30 rounded-full h-2 mb-2">
                <div className="bg-white h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
              <p className="text-xs opacity-75">35/50 words</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FeedPage;