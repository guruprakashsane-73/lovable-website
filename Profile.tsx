import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/AuthContext';
import { Badge as BadgeIcon, Award, BookOpen, FileText, TrendingUp } from 'lucide-react';
import { calculateUserRank, getUserBadges, getRankColor, getRankBgColor } from '@/utils/rankingSystem';
import { Badge } from '@/types';

export default function Profile() {
  const { user } = useAuth();
  const [rank, setRank] = useState(calculateUserRank(user?.id || ''));
  const [badges, setBadges] = useState<Badge[]>([]);
  const [stats, setStats] = useState({ enrollments: 0, submissions: 0 });

  useEffect(() => {
    if (user) {
      setRank(calculateUserRank(user.id));
      setBadges(getUserBadges(user.id));
      
      const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
      const submissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
      
      setStats({
        enrollments: enrollments.filter((e: any) => e.studentId === user.id).length,
        submissions: submissions.filter((s: any) => s.studentId === user.id).length,
      });
    }
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Profile</h1>
          <p className="text-muted-foreground text-lg">View your progress and achievements</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Current Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold capitalize ${getRankColor(rank)}`}>
                {rank}
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Keep learning to reach Platinum!
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Courses Enrolled
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.enrollments}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Assignments Submitted
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.submissions}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Your account details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">Name</p>
              <p className="text-lg font-medium">{user?.name}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Email</p>
              <p className="text-lg font-medium">{user?.email}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Role</p>
              <p className="text-lg font-medium capitalize">{user?.role}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5" />
              Badges Earned
            </CardTitle>
            <CardDescription>Your achievements on Learntrack</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <div
                  key={badge.id}
                  className="flex items-start gap-3 p-4 rounded-lg border bg-card"
                >
                  <div className="text-3xl">{badge.icon}</div>
                  <div>
                    <h3 className="font-semibold">{badge.name}</h3>
                    <p className="text-sm text-muted-foreground">{badge.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(badge.earnedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}