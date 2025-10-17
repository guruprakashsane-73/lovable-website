import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { calculateUserRank, getRankColor, getRankBgColor } from '@/utils/rankingSystem';
import { Trophy, Medal, Award } from 'lucide-react';

interface RankedUser {
  id: string;
  name: string;
  rank: string;
  enrollments: number;
  submissions: number;
  score: number;
}

export default function Rankings() {
  const [rankings, setRankings] = useState<RankedUser[]>([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('learntrack_users') || '[]');
    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    const submissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    
    const students = users.filter((u: any) => u.role === 'student');
    
    const rankedUsers: RankedUser[] = students.map((student: any) => {
      const userEnrollments = enrollments.filter((e: any) => e.studentId === student.id).length;
      const userSubmissions = submissions.filter((s: any) => s.studentId === student.id).length;
      const rank = calculateUserRank(student.id);
      
      // Calculate score
      const rankScores = { bronze: 1, silver: 2, gold: 3, platinum: 4 };
      const score = (rankScores[rank] * 100) + (userEnrollments * 10) + (userSubmissions * 20);
      
      return {
        id: student.id,
        name: student.name,
        rank,
        enrollments: userEnrollments,
        submissions: userSubmissions,
        score,
      };
    });
    
    // Sort by score
    rankedUsers.sort((a, b) => b.score - a.score);
    
    setRankings(rankedUsers);
  }, []);

  const getPositionIcon = (position: number) => {
    if (position === 0) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (position === 1) return <Medal className="w-5 h-5 text-slate-400" />;
    if (position === 2) return <Award className="w-5 h-5 text-amber-700" />;
    return null;
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Student Rankings</h1>
          <p className="text-muted-foreground text-lg">See how you compare with other learners</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {rankings.slice(0, 3).map((user, index) => (
            <Card key={user.id} className="border-2">
              <CardHeader>
                <div className="flex items-center gap-3">
                  {getPositionIcon(index)}
                  <div>
                    <CardTitle className="text-lg">{user.name}</CardTitle>
                    <CardDescription className="capitalize">{user.rank} Rank</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <span className="font-semibold">{user.score}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Courses:</span>
                    <span>{user.enrollments}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-muted-foreground">Submissions:</span>
                    <span>{user.submissions}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>All Rankings</CardTitle>
            <CardDescription>Complete leaderboard of all students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">Position</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead>Rank</TableHead>
                  <TableHead className="text-right">Enrollments</TableHead>
                  <TableHead className="text-right">Submissions</TableHead>
                  <TableHead className="text-right">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankings.map((user, index) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        {getPositionIcon(index)}
                        <span>#{index + 1}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>
                      <span className={`capitalize font-semibold ${getRankColor(user.rank as any)}`}>
                        {user.rank}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">{user.enrollments}</TableCell>
                    <TableCell className="text-right">{user.submissions}</TableCell>
                    <TableCell className="text-right font-semibold">{user.score}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}