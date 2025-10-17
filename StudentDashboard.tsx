import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, CheckCircle2, Award, TrendingUp } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Course, Enrollment } from '@/types';
import { calculateUserRank, getRankColor } from '@/utils/rankingSystem';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const [userRank, setUserRank] = useState(calculateUserRank(user?.id || ''));
  const { toast } = useToast();

  useEffect(() => {
    const allCourses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
    setCourses(allCourses);

    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    const myEnrollments = enrollments.filter((e: Enrollment) => e.studentId === user?.id);
    setEnrolledCourseIds(myEnrollments.map((e: Enrollment) => e.courseId));
    
    if (user) {
      setUserRank(calculateUserRank(user.id));
    }
  }, [user]);

  const handleEnroll = (courseId: string) => {
    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    
    const newEnrollment: Enrollment = {
      id: Math.random().toString(36).substr(2, 9),
      studentId: user!.id,
      courseId,
      enrolledAt: new Date().toISOString(),
    };

    enrollments.push(newEnrollment);
    localStorage.setItem('learntrack_enrollments', JSON.stringify(enrollments));
    setEnrolledCourseIds([...enrolledCourseIds, courseId]);
    
    // Update rank
    if (user) {
      setUserRank(calculateUserRank(user.id));
    }

    toast({
      title: 'Enrolled successfully!',
      description: 'You can now access the course content. Your rank has been updated!',
    });
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground text-lg">Explore courses and continue your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Current Rank
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-3xl font-bold capitalize ${getRankColor(userRank)}`}>
                {userRank}
              </div>
              <Link to="/student/rankings">
                <Button variant="link" className="p-0 h-auto mt-2">View Rankings</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{enrolledCourseIds.length}</CardTitle>
              <CardDescription>Enrolled Courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student/my-courses">
                <Button variant="outline" className="w-full">View My Courses</Button>
              </Link>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{courses.length}</CardTitle>
              <CardDescription>Available Courses</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/student/course-search">
                <Button variant="outline" className="w-full">Search Courses</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No courses available yet</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <Card key={course.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm text-muted-foreground">
                        <p>Instructor: {course.teacherName}</p>
                        <p>Duration: {course.duration}</p>
                      </div>
                      {isEnrolled(course.id) ? (
                        <div className="flex items-center gap-2 text-secondary">
                          <CheckCircle2 className="w-4 h-4" />
                          <span className="text-sm font-medium">Enrolled</span>
                        </div>
                      ) : (
                        <Button
                          onClick={() => handleEnroll(course.id)}
                          variant="hero"
                          className="w-full"
                        >
                          Enroll Now
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
