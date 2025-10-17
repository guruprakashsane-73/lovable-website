export type UserRole = 'student' | 'teacher';
export type UserRank = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  rank?: UserRank;
  badges?: Badge[];
}

export interface Video {
  id: string;
  title: string;
  url: string;
  duration: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  videos: Video[];
  assignmentId?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  teacherId: string;
  teacherName: string;
  modules?: Module[];
}

export interface Assignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string;
  content: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  verified?: boolean;
  published?: boolean;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
}
