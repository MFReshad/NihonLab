import React, { useState } from 'react';
import { Trophy, Flame, TrendingUp, Book, Clock, Target, ChevronRight, Calendar, Award } from 'lucide-react';
import Navbar from '../components/Navbar';

function DashboardPage({ user, onLogout, onNavigate, currentPage }) {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const stats = {
    totalWords: 245,
    wordsThisWeek: 42,
    currentStreak: 12,
    longestStreak: 28,
    totalPoints: 3450,
    timeSpent: 18.5, // hours
    accuracy: 87,
    level: 'Intermediate'
  };

  const recentActivity = [
    { date: '2024-10-25', words: 15, time: 25, points: 120 },
    { date: '2024-10-24', words: 12, time: 20, points: 95 },
    { date: '2024-10-23', words: 18, time: 30, points: 150 },
    { date: '2024-10-22', words: 10, time: 15, points: 80 },
    { date: '2024-10-21', words: 14, time: 22, points: 110 },
    { date: '2024-10-20', words: 16, time: 28, points: 130 },
    { date: '2024-10-19', words: 13, time: 18, points: 105 },
  ];

  const achievements = [
    { name: 'First Steps', description: 'Complete your first lesson', unlocked: true, icon: '🎯' },
    { name: 'Week Warrior', description: 'Maintain a 7-day streak', unlocked: true, icon: '🔥' },
    { name: 'Century Club', description: 'Learn 100 words', unlocked: true, icon: '💯' },
    { name: 'Vocabulary Master', description: 'Learn 500 words', unlocked: false, icon: '👑' },
    { name: 'Perfectionist', description: 'Get 100% accuracy in 10 lessons', unlocked: false, icon: '⭐' },
    { name: 'Night Owl', description: 'Study after midnight', unlocked: true, icon: '🦉' },
  ];

  const categories = [
    { name: 'Business', words: 68, mastery: 85, color: 'blue' },
    { name: 'Daily Life', words: 92, mastery: 78, color: 'green' },
    { name: 'Technology', words: 45, mastery: 92, color: 'purple' },
    { name: 'Travel', words: 40, mastery: 70, color: 'orange' },
  ];

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
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Book className="text-blue-600" size={24} />
              </div>
              <span className="text-xs text-gray-500">TOTAL</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalWords}</h3>
            <p className="text-sm text-gray-600 mt-1">Words Learned</p>
            <div className="mt-3 flex items-center text-green-600 text-sm">
              <TrendingUp size={16} className="mr-1" />
              <span>+{stats.wordsThisWeek} this week</span>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Flame className="text-orange-600" size={24} />
              </div>
              <span className="text-xs text-gray-500">STREAK</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.currentStreak}</h3>
            <p className="text-sm text-gray-600 mt-1">Day Streak</p>
            <div className="mt-3 text-gray-500 text-sm">
              Record: {stats.longestStreak} days
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="text-yellow-600" size={24} />
              </div>
              <span className="text-xs text-gray-500">POINTS</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.totalPoints}</h3>
            <p className="text-sm text-gray-600 mt-1">Total Points</p>
            <div className="mt-3 text-gray-500 text-sm">
              Level: {stats.level}
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <Target className="text-green-600" size={24} />
              </div>
              <span className="text-xs text-gray-500">ACCURACY</span>
            </div>
            <h3 className="text-3xl font-bold text-gray-900">{stats.accuracy}%</h3>
            <p className="text-sm text-gray-600 mt-1">Average Score</p>
            <div className="mt-3 text-gray-500 text-sm">
              {stats.timeSpent}h total time
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Activity & Categories */}
          <div className="lg:col-span-2 space-y-8">
            {/* Learning Activity Chart */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Learning Activity</h2>
                <div className="flex gap-2">
                  {['week', 'month', 'year'].map(period => (
                    <button
                      key={period}
                      onClick={() => setSelectedPeriod(period)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                        selectedPeriod === period
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {period.charAt(0).toUpperCase() + period.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                {recentActivity.map((day, index) => {
                  const maxWords = Math.max(...recentActivity.map(d => d.words));
                  const percentage = (day.words / maxWords) * 100;
                  
                  return (
                    <div key={index} className="flex items-center gap-4">
                      <span className="text-sm text-gray-600 w-24">{day.date}</span>
                      <div className="flex-1">
                        <div className="w-full bg-gray-200 rounded-full h-8 relative overflow-hidden">
                          <div 
                            className="bg-gradient-to-r from-blue-500 to-blue-600 h-full rounded-full flex items-center px-3"
                            style={{ width: `${percentage}%` }}
                          >
                            <span className="text-white text-xs font-semibold">{day.words} words</span>
                          </div>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500 w-16">{day.time} min</span>
                      <span className="text-sm font-semibold text-blue-600 w-16">+{day.points} pts</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Progress */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Category Progress</h2>
              <div className="space-y-6">
                {categories.map((category, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 bg-${category.color}-500 rounded-full`}></div>
                        <span className="font-semibold text-gray-900">{category.name}</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {category.words} words • {category.mastery}% mastery
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className={`bg-${category.color}-500 h-3 rounded-full transition-all`}
                        style={{ width: `${category.mastery}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Achievements & Goals */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Ready to Learn?</h3>
              <p className="text-sm opacity-90 mb-4">
                Keep your streak going! Complete today's lesson to maintain your {stats.currentStreak}-day streak.
              </p>
              <button
                onClick={onGoToFeed}
                className="w-full bg-white text-blue-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition flex items-center justify-center gap-2"
              >
                Start Today's Lesson <ChevronRight size={20} />
              </button>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Achievements</h2>
                <Award className="text-gray-400" size={24} />
              </div>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div 
                    key={index}
                    className={`p-4 rounded-lg border-2 ${
                      achievement.unlocked 
                        ? 'bg-blue-50 border-blue-200' 
                        : 'bg-gray-50 border-gray-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{achievement.name}</h4>
                        <p className="text-xs text-gray-600 mt-1">{achievement.description}</p>
                      </div>
                      {achievement.unlocked && (
                        <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Goal */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Weekly Goal</h3>
              <div className="text-center mb-4">
                <div className="text-4xl font-bold text-blue-600">{stats.wordsThisWeek}/50</div>
                <p className="text-sm text-gray-600 mt-1">Words this week</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(stats.wordsThisWeek / 50) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 text-center">
                {50 - stats.wordsThisWeek} more words to reach your goal!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;