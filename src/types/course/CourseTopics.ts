import { Question } from '@/types/course/Question';
import { Reading } from '@/types/course/Reading';
import { Summary } from '@/types/course/Summary';

export interface CourseTopic {
  title: string;
  key: string;
  details: string;
  order: number;
  questions: Question[];
  readings: Reading[];
  summaries: Summary[];
}
