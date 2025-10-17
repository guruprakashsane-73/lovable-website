import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { getUserBadges } from '@/utils/rankingSystem';
import { Badge as BadgeType } from '@/types';
import { Award } from 'lucide-react';

export default function Badges() {
  const { user } = useAuth();
  const [badges, setBadges] = useState<BadgeType[]>([]);
  const [allBadges] = useState<BadgeType[]>([
    {
      id: 'registration',
      name: 'Getting Started',
      description: 'Complete registration',
      icon: '🎓',
      earnedAt: '',
    },
    {
      id: 'first-enrollment',
      name: 'First Step',
      description: 'Enroll in your first course',
      icon: '📚',
      earnedAt: '',
    },
    {
      id: 'first-submission',
      name: 'Achiever',
      description: 'Submit your first assignment',
      icon: '✨',
      earnedAt: '',
    },
    {
      id: 'multi-course',
      name: 'Dedicated Learner',
      description: 'Enroll in 3+ courses',
      icon: '🌟',
      earnedAt: '',
    },
    {
      id: 'prolific',
      name: 'Prolific Student',
      description: 'Submit 5+ assignments',
      icon: '🏆',
      earnedAt: '',
    },
  ]);

  useEffect(() => {
    if (user) {
      setBadges(getUserBadges(user.id));
    }
  }, [user]);

  const hasBadge = (badgeId: string) => {
    return badges.some(b => b.id === badgeId);
  };

  const getBadgeData = (badgeId: string) => {
    return badges.find(b => b.id === badgeId);
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Badges</h1>
          <p className="text-muted-foreground text-lg">Track your achievements and milestones</p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badge Collection
            </CardTitle>
            <CardDescription>
              {badges.length} of {allBadges.length} badges earned
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {allBadges.map((badge) => {
            const earned = hasBadge(badge.id);
            const earnedBadge = getBadgeData(badge.id);
            
            return (
              <Card
                key={badge.id}
                className={`transition-all ${
                  earned
                    ? 'border-primary/50 bg-card'
                    : 'opacity-50 border-dashed'
                }`}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <div className={`text-5xl ${earned ? '' : 'grayscale'}`}>
                      {badge.icon}
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{badge.name}</CardTitle>
                      <CardDescription>{badge.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {earned && earnedBadge ? (
                    <div className="text-sm text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <span className="text-primary">✓</span>
                        Earned on {new Date(earnedBadge.earnedAt).toLocaleDateString()}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">Not earned yet</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}