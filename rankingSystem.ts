import { UserRank, Badge } from '@/types';

export function calculateUserRank(userId: string): UserRank {
  const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
  const submissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
  
  const userEnrollments = enrollments.filter((e: any) => e.studentId === userId);
  const userSubmissions = submissions.filter((s: any) => s.studentId === userId);
  
  // Platinum: Has submitted assignments
  if (userSubmissions.length > 0) {
    return 'platinum';
  }
  
  // Gold: Has enrolled in courses
  if (userEnrollments.length > 0) {
    return 'gold';
  }
  
  // Silver: Accessed courses (has account)
  const courses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
  if (courses.length > 0) {
    return 'silver';
  }
  
  // Bronze: Registered
  return 'bronze';
}

export function getUserBadges(userId: string): Badge[] {
  const badges: Badge[] = [];
  const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
  const submissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
  const userEnrollments = enrollments.filter((e: any) => e.studentId === userId);
  const userSubmissions = submissions.filter((s: any) => s.studentId === userId);
  
  // Registration badge
  badges.push({
    id: 'registration',
    name: 'Getting Started',
    description: 'Completed registration',
    icon: '🎓',
    earnedAt: new Date().toISOString(),
  });
  
  // First enrollment badge
  if (userEnrollments.length > 0) {
    badges.push({
      id: 'first-enrollment',
      name: 'First Step',
      description: 'Enrolled in your first course',
      icon: '📚',
      earnedAt: userEnrollments[0].enrolledAt,
    });
  }
  
  // First submission badge
  if (userSubmissions.length > 0) {
    badges.push({
      id: 'first-submission',
      name: 'Achiever',
      description: 'Submitted your first assignment',
      icon: '✨',
      earnedAt: userSubmissions[0].submittedAt,
    });
  }
  
  // Multiple enrollments
  if (userEnrollments.length >= 3) {
    badges.push({
      id: 'multi-course',
      name: 'Dedicated Learner',
      description: 'Enrolled in 3+ courses',
      icon: '🌟',
      earnedAt: new Date().toISOString(),
    });
  }
  
  // Multiple submissions
  if (userSubmissions.length >= 5) {
    badges.push({
      id: 'prolific',
      name: 'Prolific Student',
      description: 'Submitted 5+ assignments',
      icon: '🏆',
      earnedAt: new Date().toISOString(),
    });
  }
  
  return badges;
}

export function getRankColor(rank: UserRank): string {
  const colors = {
    bronze: 'text-amber-700',
    silver: 'text-slate-400',
    gold: 'text-yellow-500',
    platinum: 'text-cyan-400',
  };
  return colors[rank];
}

export function getRankBgColor(rank: UserRank): string {
  const colors = {
    bronze: 'bg-amber-700/10',
    silver: 'bg-slate-400/10',
    gold: 'bg-yellow-500/10',
    platinum: 'bg-cyan-400/10',
  };
  return colors[rank];
}