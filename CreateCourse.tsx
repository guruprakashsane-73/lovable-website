import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Upload, X } from 'lucide-react';

interface VideoFile {
  file: File;
  title: string;
  duration: string;
}

export default function CreateCourse() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [videos, setVideos] = useState<VideoFile[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newVideos: VideoFile[] = Array.from(files).map(file => ({
        file,
        title: file.name.replace(/\.[^/.]+$/, ''),
        duration: ''
      }));
      setVideos([...videos, ...newVideos]);
    }
  };

  const removeVideo = (index: number) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  const updateVideoTitle = (index: number, title: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index].title = title;
    setVideos(updatedVideos);
  };

  const updateVideoDuration = (index: number, duration: string) => {
    const updatedVideos = [...videos];
    updatedVideos[index].duration = duration;
    setVideos(updatedVideos);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      // Create course in database
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert({
          title,
          description,
          duration,
          teacher_id: user.id,
          teacher_name: user.name,
        })
        .select()
        .single();

      if (courseError) throw courseError;

      // Upload videos if any
      if (videos.length > 0) {
        for (let i = 0; i < videos.length; i++) {
          const video = videos[i];
          const filePath = `${user.id}/${course.id}/${video.file.name}`;

          // Upload file to storage
          const { error: uploadError } = await supabase.storage
            .from('course-videos')
            .upload(filePath, video.file);

          if (uploadError) throw uploadError;

          // Save video metadata to database
          const { error: videoError } = await supabase
            .from('course_videos')
            .insert({
              course_id: course.id,
              title: video.title,
              file_path: filePath,
              file_name: video.file.name,
              duration: video.duration,
              order_index: i,
            });

          if (videoError) throw videoError;
        }
      }

      toast({
        title: 'Course created!',
        description: 'Your course has been successfully created with videos.',
      });

      navigate('/teacher-dashboard');
    } catch (error) {
      console.error('Error creating course:', error);
      toast({
        title: 'Error',
        description: 'Failed to create course. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Create New Course</h1>
          <p className="text-muted-foreground text-lg">Share your knowledge with students</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
            <CardDescription>Enter the information for your new course</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Course Title</Label>
                <Input
                  id="title"
                  placeholder="e.g., Introduction to Web Development"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe what students will learn in this course..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 8 weeks, 3 months"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="videos">Course Videos</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 hover:border-primary transition-colors">
                  <input
                    type="file"
                    id="videos"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                  <label htmlFor="videos" className="cursor-pointer flex flex-col items-center gap-2">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Click to upload videos or drag and drop
                    </span>
                    <span className="text-xs text-muted-foreground">
                      MP4, AVI, MOV up to 500MB
                    </span>
                  </label>
                </div>

                {videos.length > 0 && (
                  <div className="space-y-3 mt-4">
                    {videos.map((video, index) => (
                      <Card key={index}>
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-1 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium">{video.file.name}</span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeVideo(index)}
                                >
                                  <X className="w-4 h-4" />
                                </Button>
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label htmlFor={`video-title-${index}`} className="text-xs">
                                    Video Title
                                  </Label>
                                  <Input
                                    id={`video-title-${index}`}
                                    value={video.title}
                                    onChange={(e) => updateVideoTitle(index, e.target.value)}
                                    placeholder="Enter video title"
                                    className="h-9"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`video-duration-${index}`} className="text-xs">
                                    Duration (optional)
                                  </Label>
                                  <Input
                                    id={`video-duration-${index}`}
                                    value={video.duration}
                                    onChange={(e) => updateVideoDuration(index, e.target.value)}
                                    placeholder="e.g., 10:30"
                                    className="h-9"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  variant="hero" 
                  size="lg" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creating...' : 'Create Course'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="lg" 
                  onClick={() => navigate('/teacher-dashboard')}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
