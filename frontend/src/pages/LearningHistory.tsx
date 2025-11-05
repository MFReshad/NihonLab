import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

const LearningHistory = () => {
  // Mock history data
  const history = [
    {
      date: '2025-11-01',
      activity: 'Completed Flashcard Session',
      cardsReviewed: 15,
      correctAnswers: 12,
      xpEarned: 120,
      status: 'completed',
    },
    {
      date: '2025-10-31',
      activity: 'Vocabulary Practice',
      cardsReviewed: 20,
      correctAnswers: 18,
      xpEarned: 180,
      status: 'completed',
    },
    {
      date: '2025-10-30',
      activity: 'Grammar Review',
      cardsReviewed: 10,
      correctAnswers: 7,
      xpEarned: 70,
      status: 'completed',
    },
    {
      date: '2025-10-29',
      activity: 'Kanji Practice',
      cardsReviewed: 25,
      correctAnswers: 20,
      xpEarned: 200,
      status: 'completed',
    },
    {
      date: '2025-10-28',
      activity: 'Mixed Review',
      cardsReviewed: 30,
      correctAnswers: 25,
      xpEarned: 250,
      status: 'completed',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-heading font-bold mb-2">Learning History</h1>
        <p className="text-muted-foreground text-lg">
          Track your progress and review past sessions
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Sessions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{history.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Cards Reviewed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {history.reduce((sum, item) => sum + item.cardsReviewed, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total XP Earned
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              {history.reduce((sum, item) => sum + item.xpEarned, 0)} XP
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History Timeline */}
      <div className="space-y-4">
        <h2 className="text-2xl font-heading font-semibold">Recent Activity</h2>
        {history.map((item, index) => {
          const accuracy = Math.round((item.correctAnswers / item.cardsReviewed) * 100);
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">{item.date}</span>
                      <Badge variant={item.status === 'completed' ? 'default' : 'secondary'}>
                        {item.status}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{item.activity}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4 text-secondary" />
                        <span>
                          {item.correctAnswers}/{item.cardsReviewed} correct
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-foreground">{accuracy}%</span> accuracy
                      </div>
                      <div>
                        <span className="font-semibold text-primary">+{item.xpEarned} XP</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    {accuracy >= 80 ? (
                      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                        <CheckCircle2 className="w-6 h-6 text-secondary" />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                        <XCircle className="w-6 h-6 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default LearningHistory;
