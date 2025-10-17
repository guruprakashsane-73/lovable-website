import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Course, Assignment, Submission } from '@/types';
import { FileText, Award, CheckCircle2, PlayCircle, Clock, Lock } from 'lucide-react';

export default function StudentCourseDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [submissionContent, setSubmissionContent] = useState<{ [key: string]: string }>({});
  const { toast } = useToast();

  useEffect(() => {
    // Load course
    const courses = JSON.parse(localStorage.getItem('learntrack_courses') || '[]');
    const foundCourse = courses.find((c: Course) => c.id === id);
    setCourse(foundCourse);

    // Load assignments
    const allAssignments = JSON.parse(localStorage.getItem('learntrack_assignments') || '[]');
    const courseAssignments = allAssignments.filter((a: Assignment) => a.courseId === id);
    setAssignments(courseAssignments);

    // Load my submissions
    const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    const mySubmissions = allSubmissions.filter((s: Submission) => s.studentId === user?.id);
    setSubmissions(mySubmissions);
  }, [id, user]);

  const handleSubmit = (assignmentId: string) => {
    const content = submissionContent[assignmentId] || '';
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter your submission content',
        variant: 'destructive',
      });
      return;
    }

    const newSubmission: Submission = {
      id: Math.random().toString(36).substr(2, 9),
      assignmentId,
      studentId: user!.id,
      studentName: user!.name,
      content,
      submittedAt: new Date().toISOString(),
      verified: false,
      published: false,
    };

    const allSubmissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    allSubmissions.push(newSubmission);
    localStorage.setItem('learntrack_submissions', JSON.stringify(allSubmissions));
    setSubmissions([...submissions, newSubmission]);

    setSubmissionContent({ ...submissionContent, [assignmentId]: '' });

    toast({
      title: 'Submission successful!',
      description: 'Your work has been submitted for verification.',
    });
  };

  const getSubmission = (assignmentId: string) => {
    return submissions.find(s => s.assignmentId === assignmentId);
  };

  const calculateOverallGrade = () => {
    const gradedSubmissions = submissions.filter(s => 
      s.grade !== undefined && 
      s.published &&
      assignments.some(a => a.id === s.assignmentId && a.courseId === id)
    );
    
    if (gradedSubmissions.length === 0) return null;
    
    const total = gradedSubmissions.reduce((sum, s) => sum + (s.grade || 0), 0);
    return (total / gradedSubmissions.length).toFixed(1);
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
          <p className="text-muted-foreground mt-2">
            Instructor: {course.teacherName} • Duration: {course.duration}
          </p>
        </div>

        <Tabs defaultValue="modules" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="modules">
              <PlayCircle className="w-4 h-4 mr-2" />
              Modules
            </TabsTrigger>
            <TabsTrigger value="assignments">
              <FileText className="w-4 h-4 mr-2" />
              Assignments
            </TabsTrigger>
            <TabsTrigger value="grades">
              <Award className="w-4 h-4 mr-2" />
              My Grades
            </TabsTrigger>
          </TabsList>

          <TabsContent value="modules">
            <div className="space-y-4">
              {!course.modules || course.modules.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <PlayCircle className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No modules available yet</p>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="single" collapsible className="space-y-4">
                  {course.modules.map((module, index) => {
                    const moduleAssignment = module.assignmentId 
                      ? assignments.find(a => a.id === module.assignmentId)
                      : null;
                    const hasSubmission = moduleAssignment 
                      ? !!getSubmission(moduleAssignment.id)
                      : false;

                    return (
                      <AccordionItem key={module.id} value={module.id} className="border rounded-lg">
                        <AccordionTrigger className="px-6 hover:no-underline">
                          <div className="flex items-center justify-between w-full pr-4">
                            <div className="flex items-center gap-4">
                              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="font-bold text-primary">{index + 1}</span>
                              </div>
                              <div className="text-left">
                                <h3 className="font-semibold text-lg">{module.title}</h3>
                                <p className="text-sm text-muted-foreground">{module.description}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="text-xs">
                                {module.videos.length} videos
                              </Badge>
                              {hasSubmission && (
                                <CheckCircle2 className="w-5 h-5 text-secondary" />
                              )}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="px-6 pb-6">
                          <div className="space-y-4 mt-4">
                            {module.videos.map((video) => (
                              <Card key={video.id} className="overflow-hidden">
                                <CardHeader className="pb-3">
                                  <div className="flex items-start justify-between">
                                    <CardTitle className="text-base">{video.title}</CardTitle>
                                    <div className="flex items-center gap-1 text-muted-foreground">
                                      <Clock className="w-4 h-4" />
                                      <span className="text-sm">{video.duration}</span>
                                    </div>
                                  </div>
                                </CardHeader>
                                <CardContent>
                                  <div className="aspect-video rounded-lg overflow-hidden bg-black">
                                    <iframe
                                      src={video.url}
                                      title={video.title}
                                      className="w-full h-full"
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                    />
                                  </div>
                                </CardContent>
                              </Card>
                            ))}

                            {moduleAssignment && (
                              <Card className="border-accent/50 bg-accent/5">
                                <CardHeader>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <FileText className="w-5 h-5 text-accent" />
                                      <CardTitle className="text-lg">Module Assignment</CardTitle>
                                    </div>
                                    {hasSubmission ? (
                                      <Badge variant="default" className="bg-secondary">
                                        <CheckCircle2 className="w-3 h-3 mr-1" />
                                        Submitted
                                      </Badge>
                                    ) : (
                                      <Badge variant="outline">Pending</Badge>
                                    )}
                                  </div>
                                  <CardDescription>{moduleAssignment.title}</CardDescription>
                                </CardHeader>
                                <CardContent>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    {moduleAssignment.description}
                                  </p>
                                  <Button
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => {
                                      const assignmentsTab = document.querySelector('[value="assignments"]') as HTMLElement;
                                      assignmentsTab?.click();
                                    }}
                                  >
                                    Go to Assignment
                                  </Button>
                                </CardContent>
                              </Card>
                            )}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>
          </TabsContent>

          <TabsContent value="assignments">
            <div className="space-y-6">
              {assignments.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <FileText className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No assignments yet</p>
                  </CardContent>
                </Card>
              ) : (
                assignments.map((assignment) => {
                  const submission = getSubmission(assignment.id);
                  const isSubmitted = !!submission;
                  
                  return (
                    <Card key={assignment.id}>
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle>{assignment.title}</CardTitle>
                            <CardDescription>{assignment.description}</CardDescription>
                          </div>
                          {isSubmitted && (
                            <div className="flex flex-col gap-2">
                              <div className="flex items-center gap-2 text-secondary">
                                <CheckCircle2 className="w-5 h-5" />
                                <span className="text-sm font-medium">Submitted</span>
                              </div>
                              {submission.verified && !submission.published && (
                                <Badge variant="outline" className="text-xs">
                                  <Lock className="w-3 h-3 mr-1" />
                                  Verified - Awaiting Publish
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Due: {new Date(assignment.dueDate).toLocaleDateString()}
                        </p>
                      </CardHeader>
                      <CardContent>
                        {isSubmitted ? (
                          <div className="space-y-3">
                            <div>
                              <Label className="text-sm font-medium">Your Submission</Label>
                              <p className="text-sm bg-muted p-3 rounded-md mt-2">{submission.content}</p>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Submitted on: {new Date(submission.submittedAt).toLocaleString()}
                            </p>
                            
                            {submission.published ? (
                              submission.grade !== undefined && (
                                <div className="pt-3 border-t">
                                  <Button variant="hero" className="w-full mb-3">
                                    <Award className="w-4 h-4 mr-2" />
                                    View Results
                                  </Button>
                                  <p className="text-sm font-medium mb-1">Grade: <span className="text-lg text-secondary">{submission.grade}%</span></p>
                                  {submission.feedback && (
                                    <div className="mt-2">
                                      <Label className="text-sm font-medium">Feedback</Label>
                                      <p className="text-sm bg-muted p-3 rounded-md mt-1">{submission.feedback}</p>
                                    </div>
                                  )}
                                </div>
                              )
                            ) : (
                              <div className="pt-3 border-t">
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Clock className="w-4 h-4" />
                                  <p className="text-sm">
                                    {submission.verified 
                                      ? 'Assignment verified. Awaiting teacher to publish results.'
                                      : 'Your submission is being reviewed by the teacher.'
                                    }
                                  </p>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor={`submission-${assignment.id}`}>Your Submission</Label>
                              <Textarea
                                id={`submission-${assignment.id}`}
                                placeholder="Enter your assignment submission here..."
                                value={submissionContent[assignment.id] || ''}
                                onChange={(e) =>
                                  setSubmissionContent({
                                    ...submissionContent,
                                    [assignment.id]: e.target.value,
                                  })
                                }
                                rows={5}
                              />
                            </div>
                            <Button
                              onClick={() => handleSubmit(assignment.id)}
                              variant="hero"
                            >
                              Submit Assignment
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>
          </TabsContent>

          <TabsContent value="grades">
            <Card>
              <CardHeader>
                <CardTitle>My Grades</CardTitle>
                <CardDescription>Your performance in this course</CardDescription>
              </CardHeader>
              <CardContent>
                {(() => {
                  const overallGrade = calculateOverallGrade();
                  const courseSubmissions = submissions.filter(s =>
                    assignments.some(a => a.id === s.assignmentId) && s.published
                  );
                  
                  return (
                    <>
                      {overallGrade !== null && (
                        <Card className="bg-gradient-to-br from-secondary/10 to-primary/10 border-secondary/20 mb-6">
                          <CardHeader>
                            <CardTitle className="text-3xl text-center">{overallGrade}%</CardTitle>
                            <CardDescription className="text-center">Overall Course Grade</CardDescription>
                          </CardHeader>
                        </Card>
                      )}

                      {courseSubmissions.length === 0 ? (
                        <p className="text-muted-foreground text-center py-8">No published grades yet</p>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Assignment</TableHead>
                              <TableHead>Submitted</TableHead>
                              <TableHead>Grade</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {courseSubmissions.map((submission) => {
                              const assignment = assignments.find(a => a.id === submission.assignmentId);
                              return (
                                <TableRow key={submission.id}>
                                  <TableCell className="font-medium">{assignment?.title}</TableCell>
                                  <TableCell>{new Date(submission.submittedAt).toLocaleDateString()}</TableCell>
                                  <TableCell>
                                    {submission.grade !== undefined ? (
                                      <span className="font-semibold text-secondary">{submission.grade}%</span>
                                    ) : (
                                      <span className="text-muted-foreground">Pending</span>
                                    )}
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      )}
                    </>
                  );
                })()}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
