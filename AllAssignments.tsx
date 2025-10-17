import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { Assignment, Submission, Course, Enrollment } from '@/types';
import { FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

export default function AllAssignments() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<(Assignment & { courseName: string })[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);

  useEffect(() => {
    if (user) {
      const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
      const userEnrollments = enrollments.filter((e: Enrollment) => e.studentId === user.id);
      
      const allAssignments = JSON.parse(localStorage.getItem('learntrack_assignments') || '[]');
      const courses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
      
      const myAssignments = allAssignments
        .filter((a: Assignment) =>
          userEnrollments.some((e: Enrollment) => e.courseId === a.courseId)
        )
        .map((a: Assignment) => {
          const course = courses.find((c: Course) => c.id === a.courseId);
          return {
            ...a,
            courseName: course?.title || 'Unknown Course',
          };
        });
      
      setAssignments(myAssignments);
      
      const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
      const mySubmissions = allSubmissions.filter((s: Submission) => s.studentId === user.id);
      setSubmissions(mySubmissions);
    }
  }, [user]);

  const getSubmissionStatus = (assignmentId: string) => {
    const submission = submissions.find(s => s.assignmentId === assignmentId);
    if (!submission) return { status: 'pending', text: 'Not Submitted', icon: Clock };
    if (submission.grade !== undefined) return { status: 'graded', text: 'Graded', icon: CheckCircle2 };
    return { status: 'submitted', text: 'Submitted', icon: AlertCircle };
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">All Assignments</h1>
          <p className="text-muted-foreground text-lg">View and manage all your assignments</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{assignments.length}</CardTitle>
              <CardDescription>Total Assignments</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">{submissions.length}</CardTitle>
              <CardDescription>Submitted</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                {submissions.filter(s => s.grade !== undefined).length}
              </CardTitle>
              <CardDescription>Graded</CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="space-y-4">
          {assignments.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No assignments available</p>
                <Link to="/student-dashboard" className="text-primary hover:underline mt-2 inline-block">
                  Enroll in courses to see assignments
                </Link>
              </CardContent>
            </Card>
          ) : (
            assignments.map((assignment) => {
              const status = getSubmissionStatus(assignment.id);
              const submission = submissions.find(s => s.assignmentId === assignment.id);
              const overdue = !submission && isOverdue(assignment.dueDate);
              
              return (
                <Card key={assignment.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle>{assignment.title}</CardTitle>
                          <Badge variant={status.status === 'graded' ? 'default' : 'secondary'}>
                            {status.text}
                          </Badge>
                          {overdue && (
                            <Badge variant="destructive">Overdue</Badge>
                          )}
                        </div>
                        <CardDescription>{assignment.description}</CardDescription>
                        <p className="text-sm text-muted-foreground mt-2">
                          Course: {assignment.courseName} • Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <status.icon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  </CardHeader>
                  {submission && submission.grade !== undefined && (
                    <CardContent>
                      <div className="flex items-center gap-4">
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">Grade</p>
                          <p className="text-2xl font-bold text-secondary">{submission.grade}%</p>
                        </div>
                        {submission.feedback && (
                          <div className="flex-1">
                            <p className="text-sm text-muted-foreground">Feedback</p>
                            <p className="text-sm">{submission.feedback}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}