import { NavLink } from 'react-router-dom';
import { BookOpen, GraduationCap, Home, Plus, FileText, Users, Award, LogOut, User, CheckSquare, Trophy, Medal, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

export const Sidebar = () => {
  const { user, logout } = useAuth();

  const teacherLinks = [
    { to: '/teacher-dashboard', icon: Home, label: 'Dashboard' },
    { to: '/teacher/create-course', icon: Plus, label: 'Create Course' },
  ];

  const studentLinks = [
    { to: '/student-dashboard', icon: Home, label: 'Dashboard' },
    { to: '/student/profile', icon: User, label: 'My Profile' },
    { to: '/student/my-courses', icon: BookOpen, label: 'My Courses' },
    { to: '/student/course-search', icon: Search, label: 'Search Courses' },
    { to: '/student/assignments', icon: FileText, label: 'Assignments' },
    { to: '/student/daily-tasks', icon: CheckSquare, label: 'Daily Tasks' },
    { to: '/student/rankings', icon: Trophy, label: 'Rankings' },
    { to: '/student/badges', icon: Medal, label: 'Badges' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;

  return (
    <aside className="w-64 bg-background border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Learntrack</h1>
            <p className="text-xs text-muted-foreground">Innovation & Growth</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                isActive
                  ? 'bg-primary text-primary-foreground shadow-lg font-semibold'
                  : 'text-foreground bg-muted/50 hover:bg-primary/20 hover:text-primary font-medium'
              }`
            }
          >
            <link.icon className="w-5 h-5 flex-shrink-0" />
            <span>{link.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="mb-3 px-4">
          <p className="text-sm font-medium text-foreground">{user?.name}</p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
          <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-primary/20 text-primary font-medium">
            {user?.role === 'teacher' ? 'Teacher' : 'Student'}
          </span>
        </div>
        <Button
          onClick={logout}
          variant="ghost"
          className="w-full justify-start text-foreground hover:bg-destructive/10 hover:text-destructive"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Logout
        </Button>
      </div>
    </aside>
  );
};
