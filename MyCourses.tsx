import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Course, Enrollment } from '@/types';

export default function MyCourses() {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState<Course[]>([]);

  useEffect(() => {
    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    const myEnrollments = enrollments.filter((e: Enrollment) => e.studentId === user?.id);
    
    const allCourses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
    const myCourses = allCourses.filter((course: Course) =>
      myEnrollments.some((e: Enrollment) => e.courseId === course.id)
    );
    
    setEnrolledCourses(myCourses);
  }, [user]);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Courses</h1>
          <p className="text-muted-foreground text-lg">Courses you're currently enrolled in</p>
        </div>

        {enrolledCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">You're not enrolled in any courses yet</p>
              <Link to="/student-dashboard" className="text-primary hover:underline">
                Browse available courses
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {enrolledCourses.map((course) => (
              <Link key={course.id} to={`/student/course/${course.id}`}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Instructor: {course.teacherName}</p>
                      <p>Duration: {course.duration}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
