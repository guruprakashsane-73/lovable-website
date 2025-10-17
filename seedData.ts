import { Course } from '@/types';

export const initializeSampleCourses = () => {
  // Check if courses already exist
  const existingCourses = localStorage.getItem('learntrack_courses');
  if (existingCourses && JSON.parse(existingCourses).length > 0) {
    return; // Don't overwrite existing courses
  }

  const sampleCourses: Course[] = [
    {
      id: 'course-python-101',
      title: 'Python Programming',
      description: 'Learn Python from scratch with hands-on examples and real-world projects',
      duration: '8 weeks',
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Johnson',
      modules: [
        {
          id: 'mod-py-1',
          title: 'Introduction to Python',
          description: 'Get started with Python basics and setup',
          videos: [
            {
              id: 'vid-py-1-1',
              title: 'Course Introduction',
              url: 'https://www.youtube.com/embed/kqtD5dpn9C8',
              duration: '15:30'
            },
            {
              id: 'vid-py-1-2',
              title: 'Installing Python',
              url: 'https://www.youtube.com/embed/YYXdXT2l-Gg',
              duration: '12:45'
            },
            {
              id: 'vid-py-1-3',
              title: 'Your First Python Program',
              url: 'https://www.youtube.com/embed/rfscVS0vtbw',
              duration: '18:20'
            }
          ]
        },
        {
          id: 'mod-py-2',
          title: 'Python Fundamentals',
          description: 'Variables, data types, and control structures',
          videos: [
            {
              id: 'vid-py-2-1',
              title: 'Variables and Data Types',
              url: 'https://www.youtube.com/embed/LKYFiINMhIM',
              duration: '22:15'
            },
            {
              id: 'vid-py-2-2',
              title: 'Control Flow',
              url: 'https://www.youtube.com/embed/Zp5MuPOtsSY',
              duration: '25:30'
            }
          ],
          assignmentId: 'assign-py-1'
        }
      ]
    },
    {
      id: 'course-webdev-101',
      title: 'Web Development Basics',
      description: 'Master HTML, CSS, and JavaScript fundamentals for modern web development',
      duration: '10 weeks',
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Johnson',
      modules: [
        {
          id: 'mod-web-1',
          title: 'HTML & CSS Basics',
          description: 'Learn the building blocks of web pages',
          videos: [
            {
              id: 'vid-web-1-1',
              title: 'Web Development Overview',
              url: 'https://www.youtube.com/embed/UB1O30fR-EE',
              duration: '20:00'
            },
            {
              id: 'vid-web-1-2',
              title: 'HTML Structure',
              url: 'https://www.youtube.com/embed/qz0aGYrrlhU',
              duration: '28:15'
            },
            {
              id: 'vid-web-1-3',
              title: 'CSS Styling',
              url: 'https://www.youtube.com/embed/1Rs2ND1ryYc',
              duration: '32:40'
            }
          ]
        },
        {
          id: 'mod-web-2',
          title: 'JavaScript Essentials',
          description: 'Add interactivity to your web pages',
          videos: [
            {
              id: 'vid-web-2-1',
              title: 'JavaScript Introduction',
              url: 'https://www.youtube.com/embed/W6NZfCO5SIk',
              duration: '30:20'
            },
            {
              id: 'vid-web-2-2',
              title: 'DOM Manipulation',
              url: 'https://www.youtube.com/embed/5fb2aPlgoys',
              duration: '35:15'
            }
          ],
          assignmentId: 'assign-web-1'
        }
      ]
    },
    {
      id: 'course-ds-advanced',
      title: 'Advanced Data Structures',
      description: 'Deep dive into complex data structures and algorithms',
      duration: '12 weeks',
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Johnson',
      modules: [
        {
          id: 'mod-ds-1',
          title: 'Trees and Graphs',
          description: 'Understanding hierarchical and network data structures',
          videos: [
            {
              id: 'vid-ds-1-1',
              title: 'Introduction to Trees',
              url: 'https://www.youtube.com/embed/qH6yxkw0u78',
              duration: '25:30'
            },
            {
              id: 'vid-ds-1-2',
              title: 'Binary Search Trees',
              url: 'https://www.youtube.com/embed/pYT9F8_LFTM',
              duration: '30:45'
            },
            {
              id: 'vid-ds-1-3',
              title: 'Graph Algorithms',
              url: 'https://www.youtube.com/embed/tWVWeAqZ0WU',
              duration: '40:20'
            }
          ],
          assignmentId: 'assign-ds-1'
        }
      ]
    },
    {
      id: 'course-java-101',
      title: 'Java Programming',
      description: 'Object-oriented programming with Java from beginner to intermediate',
      duration: '10 weeks',
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Johnson',
      modules: [
        {
          id: 'mod-java-1',
          title: 'Java Fundamentals',
          description: 'Getting started with Java programming',
          videos: [
            {
              id: 'vid-java-1-1',
              title: 'Introduction to Java',
              url: 'https://www.youtube.com/embed/eIrMbAQSU34',
              duration: '18:40'
            },
            {
              id: 'vid-java-1-2',
              title: 'Object-Oriented Concepts',
              url: 'https://www.youtube.com/embed/6T_HgnjoYwM',
              duration: '28:50'
            }
          ]
        },
        {
          id: 'mod-java-2',
          title: 'Classes and Objects',
          description: 'Deep dive into OOP principles',
          videos: [
            {
              id: 'vid-java-2-1',
              title: 'Creating Classes',
              url: 'https://www.youtube.com/embed/OKlFgjDS7FQ',
              duration: '32:15'
            }
          ],
          assignmentId: 'assign-java-1'
        }
      ]
    },
    {
      id: 'course-mysql-101',
      title: 'MySQL Database',
      description: 'Learn database design and SQL queries with MySQL',
      duration: '6 weeks',
      teacherId: 'teacher-1',
      teacherName: 'Dr. Sarah Johnson',
      modules: [
        {
          id: 'mod-sql-1',
          title: 'Database Fundamentals',
          description: 'Introduction to relational databases',
          videos: [
            {
              id: 'vid-sql-1-1',
              title: 'What is a Database?',
              url: 'https://www.youtube.com/embed/wR0jg0eQsZA',
              duration: '15:20'
            },
            {
              id: 'vid-sql-1-2',
              title: 'SQL Basics',
              url: 'https://www.youtube.com/embed/7S_tz1z_5bA',
              duration: '35:40'
            }
          ]
        },
        {
          id: 'mod-sql-2',
          title: 'Advanced Queries',
          description: 'Joins, subqueries, and optimization',
          videos: [
            {
              id: 'vid-sql-2-1',
              title: 'JOIN Operations',
              url: 'https://www.youtube.com/embed/9yeOJ0ZMUYw',
              duration: '28:30'
            }
          ],
          assignmentId: 'assign-sql-1'
        }
      ]
    }
  ];

  // Save sample courses
  localStorage.setItem('learntrack_courses', JSON.stringify(sampleCourses));

  // Create sample assignments for modules
  const sampleAssignments = [
    {
      id: 'assign-py-1',
      courseId: 'course-python-101',
      title: 'Python Fundamentals Assignment',
      description: 'Write a program that demonstrates variables, loops, and conditional statements',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'assign-web-1',
      courseId: 'course-webdev-101',
      title: 'Build a Simple Web Page',
      description: 'Create a responsive web page using HTML, CSS, and JavaScript',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'assign-ds-1',
      courseId: 'course-ds-advanced',
      title: 'Implement a Binary Search Tree',
      description: 'Create a BST with insert, delete, and search operations',
      dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'assign-java-1',
      courseId: 'course-java-101',
      title: 'OOP Project',
      description: 'Design a class hierarchy for a library management system',
      dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'assign-sql-1',
      courseId: 'course-mysql-101',
      title: 'Database Design Project',
      description: 'Design and implement a database schema with complex queries',
      dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const existingAssignments = JSON.parse(localStorage.getItem('learntrack_assignments') || '[]');
  const newAssignments = [...existingAssignments, ...sampleAssignments];
  localStorage.setItem('learntrack_assignments', JSON.stringify(newAssignments));
};
