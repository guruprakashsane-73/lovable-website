-- Create courses table
CREATE TABLE public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  duration TEXT NOT NULL,
  teacher_id UUID NOT NULL,
  teacher_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

-- Teachers can create and manage their own courses
CREATE POLICY "Teachers can create courses"
  ON public.courses
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Teachers can view their own courses"
  ON public.courses
  FOR SELECT
  USING (true);

CREATE POLICY "Teachers can update their own courses"
  ON public.courses
  FOR UPDATE
  USING (teacher_id = auth.uid());

CREATE POLICY "Teachers can delete their own courses"
  ON public.courses
  FOR DELETE
  USING (teacher_id = auth.uid());

-- Create course_videos table
CREATE TABLE public.course_videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  duration TEXT,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.course_videos ENABLE ROW LEVEL SECURITY;

-- Anyone can view videos for courses
CREATE POLICY "Anyone can view course videos"
  ON public.course_videos
  FOR SELECT
  USING (true);

-- Teachers can add videos to their courses
CREATE POLICY "Teachers can add videos to their courses"
  ON public.course_videos
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Teachers can update videos in their courses
CREATE POLICY "Teachers can update their course videos"
  ON public.course_videos
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Teachers can delete videos from their courses
CREATE POLICY "Teachers can delete their course videos"
  ON public.course_videos
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.courses
      WHERE id = course_id AND teacher_id = auth.uid()
    )
  );

-- Create storage bucket for course videos
INSERT INTO storage.buckets (id, name, public) 
VALUES ('course-videos', 'course-videos', true);

-- Storage policies for course videos
CREATE POLICY "Anyone can view course videos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'course-videos');

CREATE POLICY "Authenticated users can upload course videos"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'course-videos' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update their own course videos"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'course-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own course videos"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'course-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();