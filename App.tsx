import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { initializeSampleCourses } from "./utils/seedData";
import Welcome from "./pages/Welcome";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import CreateCourse from "./pages/teacher/CreateCourse";
import TeacherCourseDetail from "./pages/teacher/CourseDetail";
import StudentDashboard from "./pages/student/StudentDashboard";
import MyCourses from "./pages/student/MyCourses";
import StudentCourseDetail from "./pages/student/StudentCourseDetail";
import Profile from "./pages/student/Profile";
import DailyTasks from "./pages/student/DailyTasks";
import Rankings from "./pages/student/Rankings";
import Badges from "./pages/student/Badges";
import AllAssignments from "./pages/student/AllAssignments";
import CourseSearch from "./pages/student/CourseSearch";
import NotFound from "./pages/NotFound";

// Initialize sample courses on app load
initializeSampleCourses();

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/create-course" element={<CreateCourse />} />
            <Route path="/teacher/course/:id" element={<TeacherCourseDetail />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student/profile" element={<Profile />} />
            <Route path="/student/my-courses" element={<MyCourses />} />
            <Route path="/student/course/:id" element={<StudentCourseDetail />} />
            <Route path="/student/daily-tasks" element={<DailyTasks />} />
            <Route path="/student/rankings" element={<Rankings />} />
            <Route path="/student/badges" element={<Badges />} />
            <Route path="/student/assignments" element={<AllAssignments />} />
            <Route path="/student/course-search" element={<CourseSearch />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
