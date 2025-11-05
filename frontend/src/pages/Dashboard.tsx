import { useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { BookOpen, Flame, Trophy, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import gsap from 'gsap';

const Dashboard = () => {
  const { userProgress, user } = useStore();

  useEffect(() => {
    gsap.fromTo(
      '.stat-card',
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' }
    );
  }, []);

  const stats = [
    {
      icon: Flame,
      label: 'Current Streak',
      value: `${userProgress.streak} days`,
      color: 'text-flame',
    },
    {
      icon: BookOpen,
      label: 'Cards Learned',
      value: userProgress.cardsLearned,
      color: 'text-primary',
    },
    {
      icon: Trophy,
      label: 'Current Level',
      value: `Level ${userProgress.level}`,
      color: 'text-secondary',
    },
    {
      icon: TrendingUp,
      label: 'Total XP',
      value: `${userProgress.xp} XP`,
      color: 'text-accent',
    },
  ];

  const xpToNextLevel = userProgress.level * 1000;
  const currentLevelXP = userProgress.xp % 1000;
  const progressPercent = (currentLevelXP / 1000) * 100;

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="stat-card">
        <h1 className="text-4xl font-heading font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-muted-foreground text-lg">
          Ready to continue your Japanese learning journey?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="stat-card hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </CardTitle>
                <Icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Level Progress */}
      <Card className="stat-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Level Progress</span>
            <span className="text-sm font-normal text-muted-foreground">
              {currentLevelXP} / 1000 XP
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Progress value={progressPercent} className="h-3" />
          <p className="text-sm text-muted-foreground">
            {1000 - currentLevelXP} XP until Level {userProgress.level + 1}
          </p>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="stat-card">
        <h2 className="text-2xl font-heading font-semibold mb-4">
          Continue Learning
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-primary/10 to-primary/5">
            <CardContent className="p-6">
              <BookOpen className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Practice Flashcards</h3>
              <p className="text-sm text-muted-foreground">
                Review your vocabulary cards
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-secondary/10 to-secondary/5">
            <CardContent className="p-6">
              <TrendingUp className="w-8 h-8 text-secondary mb-3" />
              <h3 className="font-semibold mb-1">Explore Wordlist</h3>
              <p className="text-sm text-muted-foreground">
                Discover new Japanese words
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer bg-gradient-to-br from-sakura-pink/20 to-sakura-light/10">
            <CardContent className="p-6">
              <Trophy className="w-8 h-8 text-sakura-pink mb-3" />
              <h3 className="font-semibold mb-1">View History</h3>
              <p className="text-sm text-muted-foreground">
                Track your learning journey
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
