import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Course, Assignment, Enrollment, Submission, User } from '@/types';
import { Users, FileText, Award, CheckCircle2, Eye } from 'lucide-react';

export default function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<User[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [selectedAssignment, setSelectedAssignment] = useState<string>('');
  const [gradeDialogOpen, setGradeDialogOpen] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);
  const [grade, setGrade] = useState('');
  const [feedback, setFeedback] = useState('');
  
  // Assignment form
  const [assignmentTitle, setAssignmentTitle] = useState('');
  const [assignmentDescription, setAssignmentDescription] = useState('');
  const [assignmentDueDate, setAssignmentDueDate] = useState('');
  
  const { toast } = useToast();

  useEffect(() => {
    // Load course
    const courses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
    const foundCourse = courses.find((c: Course) => c.id === id);
    setCourse(foundCourse);

    // Load enrolled students
    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    const courseEnrollments = enrollments.filter((e: Enrollment) => e.courseId === id);
    const users = JSON.parse(localStorage.getItem('learntrack_users') || '[]');
    const students = users.filter((u: User) => 
      courseEnrollments.some((e: Enrollment) => e.studentId === u.id)
    );
    setEnrolledStudents(students);

    // Load assignments
    const allAssignments = JSON.parse(localStorage.getItem('learntrack_assignments') || '[]');
    const courseAssignments = allAssignments.filter((a: Assignment) => a.courseId === id);
    setAssignments(courseAssignments);

    // Load submissions
    const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    setSubmissions(allSubmissions);
  }, [id]);

  const handleCreateAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newAssignment: Assignment = {
      id: Math.random().toString(36).substr(2, 9),
      courseId: id!,
      title: assignmentTitle,
      description: assignmentDescription,
      dueDate: assignmentDueDate,
    };

    const allAssignments = JSON.parse(localStorage.getItem('learntrack_assignments') || '[]');
    allAssignments.push(newAssignment);
    localStorage.setItem('learntrack_assignments', JSON.stringify(allAssignments));
    setAssignments([...assignments, newAssignment]);

    setAssignmentTitle('');
    setAssignmentDescription('');
    setAssignmentDueDate('');

    toast({
      title: 'Assignment created!',
      description: 'Students can now submit their work.',
    });
  };

  const handleVerifySubmission = (submission: Submission) => {
    const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    const updatedSubmissions = allSubmissions.map((s: Submission) =>
      s.id === submission.id ? { ...s, verified: true } : s
    );
    localStorage.setItem('learntrack_submissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);

    toast({
      title: 'Submission verified!',
      description: 'You can now grade and publish the results.',
    });
  };

  const handleGradeSubmission = () => {
    if (!selectedSubmission) return;

    const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    const updatedSubmissions = allSubmissions.map((s: Submission) =>
      s.id === selectedSubmission.id
        ? { ...s, grade: parseInt(grade), feedback, verified: true }
        : s
    );
    localStorage.setItem('learntrack_submissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);

    toast({
      title: 'Grade saved!',
      description: 'You can now publish the results to make them visible to the student.',
    });

    setGradeDialogOpen(false);
    setGrade('');
    setFeedback('');
  };

  const handlePublishResults = (submission: Submission) => {
    if (submission.grade === undefined) {
      toast({
        title: 'Error',
        description: 'Please grade the submission before publishing.',
        variant: 'destructive',
      });
      return;
    }

    const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    const updatedSubmissions = allSubmissions.map((s: Submission) =>
      s.id === submission.id ? { ...s, published: true } : s
    );
    localStorage.setItem('learntrack_submissions', JSON.stringify(updatedSubmissions));
    setSubmissions(updatedSubmissions);

    toast({
      title: 'Results published!',
      description: 'The student can now view their grade and feedback.',
    });
  };

  const getSubmissionsForAssignment = (assignmentId: string) => {
    return submissions.filter(s => s.assignmentId === assignmentId);
  };

  if (!course) {
    return <DashboardLayout><div className="p-8">Course not found</div></DashboardLayout>;
  }

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">{course.title}</h1>
          <p className="text-muted-foreground text-lg">{course.description}</p>
          <p className="text-muted-foreground mt-2">Duration: {course.duration}</p>
        </div>

        <Tabs defaultValue="students" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="students">
              <Users className="w-4 h-4 mr-2" />
              Enrolled Students
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="grading">
              <Award className="w-4 h-4 mr-2" />
              Submissions & Grading
            </TabsTrigger>
          </TabsList>

          <TabsContent value="students">
            <Card>
              <CardHeader>
                <CardTitle>Enrolled Students ({enrolledStudents.length})</CardTitle>
                <CardDescription>Students currently enrolled in this course</CardDescription>
              </CardHeader>
              <CardContent>
                {enrolledStudents.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">No students enrolled yet</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {enrolledStudents.map((student) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">{student.name}</TableCell>
                          <TableCell>{student.email}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Create New Assignment</CardTitle>
                  <CardDescription>Add assignments for your students</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreateAssignment} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="assignment-title">Title</Label>
                      <Input
                        id="assignment-title"
                        placeholder="Assignment title"
                        value={assignmentTitle}
                        onChange={(e) => setAssignmentTitle(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignment-description">Description</Label>
                      <Textarea
                        id="assignment-description"
                        placeholder="Assignment description"
                        value={assignmentDescription}
                        onChange={(e) => setAssignmentDescription(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="assignment-due">Due Date</Label>
                      <Input
                        id="assignment-due"
                        type="date"
                        value={assignmentDueDate}
                        onChange={(e) => setAssignmentDueDate(e.target.value)}
                        required
                      />
                    </div>
                    <Button type="submit" variant="hero">Create Assignment</Button>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Existing Assignments ({assignments.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  {assignments.length === 0 ? (
                    <p className="text-muted-foreground text-center py-8">No assignments created yet</p>
                  ) : (
                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <Card key={assignment.id}>
                          <CardHeader>
                            <CardTitle className="text-lg">{assignment.title}</CardTitle>
                            <CardDescription>{assignment.description}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <p className="text-sm text-muted-foreground">
                              Due: {new Date(assignment.dueDate).toLocaleDateString()}
                            </p>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="grading">
            <Card>
              <CardHeader>
                <CardTitle>Student Submissions</CardTitle>
                <CardDescription>Review, verify, grade, and publish student work</CardDescription>
              </CardHeader>
              <CardContent>
                {assignments.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8">Create assignments first to see submissions</p>
                ) : (
                  <div className="space-y-6">
                    {assignments.map((assignment) => {
                      const assignmentSubmissions = getSubmissionsForAssignment(assignment.id);
                      return (
                        <div key={assignment.id}>
                          <h3 className="font-semibold text-lg mb-3">{assignment.title}</h3>
                          {assignmentSubmissions.length === 0 ? (
                            <p className="text-muted-foreground text-sm mb-4">No submissions yet</p>
                          ) : (
                            <Table className="mb-4">
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Student</TableHead>
                                  <TableHead>Submitted</TableHead>
                                  <TableHead>Status</TableHead>
                                  <TableHead>Grade</TableHead>
                                  <TableHead>Actions</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {assignmentSubmissions.map((submission) => (
                                  <TableRow key={submission.id}>
                                    <TableCell className="font-medium">{submission.studentName}</TableCell>
                                    <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                      {submission.published ? (
                                        <Badge variant="default" className="bg-secondary">
                                          <CheckCircle2 className="w-3 h-3 mr-1" />
                                          Published
                                        </Badge>
                                      ) : submission.verified ? (
                                        <Badge variant="outline" className="text-accent border-accent">
                                          Verified
                                        </Badge>
                                      ) : (
                                        <Badge variant="outline">Pending</Badge>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {submission.grade !== undefined ? (
                                        <span className="font-semibold text-secondary">{submission.grade}%</span>
                                      ) : (
                                        <span className="text-muted-foreground">Not graded</span>
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      <div className="flex gap-2">
                                        {!submission.verified && (
                                          <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleVerifySubmission(submission)}
                                          >
                                            <CheckCircle2 className="w-4 h-4 mr-1" />
                                            Verify
                                          </Button>
                                        )}
                                        <Dialog open={gradeDialogOpen && selectedSubmission?.id === submission.id} onOpenChange={setGradeDialogOpen}>
                                          <DialogTrigger asChild>
                                            <Button
                                              variant="outline"
                                              size="sm"
                                              onClick={() => {
                                                setSelectedSubmission(submission);
                                                setGrade(submission.grade?.toString() || '');
                                                setFeedback(submission.feedback || '');
                                              }}
                                            >
                                              {submission.grade !== undefined ? 'Edit Grade' : 'Grade'}
                                            </Button>
                                          </DialogTrigger>
                                          <DialogContent>
                                            <DialogHeader>
                                              <DialogTitle>Grade Submission</DialogTitle>
                                              <DialogDescription>
                                                Student: {submission.studentName}
                                              </DialogDescription>
                                            </DialogHeader>
                                            <div className="space-y-4">
                                              <div>
                                                <Label className="text-sm font-medium mb-2 block">Submission</Label>
                                                <p className="text-sm bg-muted p-3 rounded-md max-h-32 overflow-y-auto">{submission.content}</p>
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="grade">Grade (%)</Label>
                                                <Input
                                                  id="grade"
                                                  type="number"
                                                  min="0"
                                                  max="100"
                                                  value={grade}
                                                  onChange={(e) => setGrade(e.target.value)}
                                                  placeholder="Enter grade (0-100)"
                                                />
                                              </div>
                                              <div className="space-y-2">
                                                <Label htmlFor="feedback">Feedback</Label>
                                                <Textarea
                                                  id="feedback"
                                                  value={feedback}
                                                  onChange={(e) => setFeedback(e.target.value)}
                                                  placeholder="Provide feedback to the student"
                                                  rows={4}
                                                />
                                              </div>
                                              <Button onClick={handleGradeSubmission} variant="hero" className="w-full">
                                                Submit Grade
                                              </Button>
                                            </div>
                                          </DialogContent>
                                        </Dialog>
                                        {submission.verified && submission.grade !== undefined && !submission.published && (
                                          <Button
                                            variant="hero"
                                            size="sm"
                                            onClick={() => handlePublishResults(submission)}
                                          >
                                            <Eye className="w-4 h-4 mr-1" />
                                            Publish Results
                                          </Button>
                                        )}
                                      </div>
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
