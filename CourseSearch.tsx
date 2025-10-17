import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Course, Enrollment } from '@/types';
import { Search, BookOpen, CheckCircle2 } from 'lucide-react';

export default function CourseSearch() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [courses, setCourses] = useState<Course[]>([]);
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const allCourses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
    setCourses(allCourses);
    setFilteredCourses(allCourses);

    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    const myEnrollments = enrollments.filter((e: Enrollment) => e.studentId === user?.id);
    setEnrolledCourseIds(myEnrollments.map((e: Enrollment) => e.courseId));
  }, [user]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const filtered = courses.filter(
        (course) =>
          course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          course.teacherName.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCourses(filtered);
    }
  }, [searchQuery, courses]);

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

    toast({
      title: 'Enrolled successfully!',
      description: 'You can now access the course content.',
    });
  };

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Search Courses</h1>
          <p className="text-muted-foreground text-lg">Find the perfect course for your learning journey</p>
        </div>

        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search by title, description, or instructor..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mb-4">
          <p className="text-muted-foreground">
            Found {filteredCourses.length} course{filteredCourses.length !== 1 ? 's' : ''}
          </p>
        </div>

        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                {searchQuery ? 'No courses found matching your search' : 'No courses available yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => (
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
    </DashboardLayout>
  );
}