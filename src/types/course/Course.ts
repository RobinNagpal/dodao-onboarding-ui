import { CourseTopic } from '@/types/course/CourseTopics';

export interface Course {
  key: string;
  title: string;
  summary: string;
  details: string;
  duration: string;
  topics: CourseTopic[];
}
