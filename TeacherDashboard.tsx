import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Course } from '@/types';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const storedCourses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
    const myCourses = storedCourses.filter((course: Course) => course.teacherId === user?.id);
    setCourses(myCourses);
  }, [user]);

  const enrollmentCounts = courses.map(course => {
    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    return enrollments.filter((e: any) => e.courseId === course.id).length;
  });

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {user?.name}</h1>
          <p className="text-muted-foreground text-lg">Manage your courses and track student progress</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{courses.length}</CardTitle>
              <CardDescription>Total Courses</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{enrollmentCounts.reduce((a, b) => a + b, 0)}</CardTitle>
              <CardDescription>Total Students</CardDescription>
            </CardHeader>
          </Card>
          <Card className="bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Course
              </CardTitle>
              <CardDescription>Start building new content</CardDescription>
            </CardHeader>
            <CardContent>
              <Link to="/teacher/create-course">
                <Button variant="hero" className="w-full">
                  New Course
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Courses</h2>
          {courses.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground mb-4">You haven't created any courses yet</p>
                <Link to="/teacher/create-course">
                  <Button variant="hero">Create Your First Course</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course, index) => (
                <Link key={course.id} to={`/teacher/course/${course.id}`}>
                  <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                    <CardHeader>
                      <CardTitle className="line-clamp-1">{course.title}</CardTitle>
                      <CardDescription className="line-clamp-2">{course.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                        <Users className="w-4 h-4" />
                        <span>{enrollmentCounts[index]} students enrolled</span>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        Duration: {course.duration}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
