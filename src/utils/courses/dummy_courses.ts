import { Course } from '@/types/course/Course';
import defiCourse from './defi-course.json';
import rustCourse from './rust-course.json';
import solidityCourse from './solidity-course.json';

export const courses = [defiCourse, rustCourse, solidityCourse];

export const findCourse = (courseKey: string): Course => courses.find(course => course.key === courseKey)!;
