import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/context/AuthContext';
import { Calendar, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  completed: boolean;
}

export default function DailyTasks() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Generate daily tasks based on user's enrollments and assignments
    const enrollments = JSON.parse(localStorage.getItem('learntrack_enrollments') || '[]');
    const assignments = JSON.parse(localStorage.getItem('learntrack_assignments') || '[]');
    const submissions = JSON.parse(localStorage.getItem('learntrack_submissions') || '[]');
    
    const userEnrollments = enrollments.filter((e: any) => e.studentId === user?.id);
    const userSubmissions = submissions.filter((s: any) => s.studentId === user?.id);
    
    const dailyTasks: Task[] = [
      {
        id: '1',
        title: 'Review today\'s course materials',
        completed: false,
      },
    ];
    
    // Add tasks for pending assignments
    userEnrollments.forEach((enrollment: any) => {
      const courseAssignments = assignments.filter((a: any) => a.courseId === enrollment.courseId);
      courseAssignments.forEach((assignment: any) => {
        const hasSubmission = userSubmissions.some((s: any) => s.assignmentId === assignment.id);
        if (!hasSubmission) {
          dailyTasks.push({
            id: `assignment-${assignment.id}`,
            title: `Complete assignment: ${assignment.title}`,
            completed: false,
          });
        }
      });
    });
    
    // Load saved task progress
    const savedProgress = JSON.parse(localStorage.getItem(`daily_tasks_${user?.id}`) || '{}');
    const today = new Date().toDateString();
    
    if (savedProgress.date === today) {
      const updatedTasks = dailyTasks.map(task => ({
        ...task,
        completed: savedProgress.tasks?.[task.id] || false,
      }));
      setTasks(updatedTasks);
    } else {
      setTasks(dailyTasks);
    }
  }, [user]);

  const toggleTask = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    
    // Save progress
    const progress = {
      date: new Date().toDateString(),
      tasks: updatedTasks.reduce((acc, task) => ({ ...acc, [task.id]: task.completed }), {}),
    };
    localStorage.setItem(`daily_tasks_${user?.id}`, JSON.stringify(progress));
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const progress = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Daily Tasks</h1>
          <p className="text-muted-foreground text-lg">Stay on track with your learning goals</p>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Progress
            </CardTitle>
            <CardDescription>
              {completedCount} of {tasks.length} tasks completed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={progress} className="h-3" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Your Tasks</CardTitle>
            <CardDescription>Complete these tasks to make progress today</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {tasks.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>No tasks for today. Great job staying on top of everything!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  className="flex items-center space-x-3 p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors"
                >
                  <Checkbox
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    id={task.id}
                  />
                  <label
                    htmlFor={task.id}
                    className={`flex-1 cursor-pointer ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}
                  >
                    {task.title}
                  </label>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}