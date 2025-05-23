import { Course, Grade } from '@/types';

export const getGradeValue = (grade: Grade): number => {
  switch (grade) {
    case 'Pass':
      return 3.0;
    case 'Good':
      return 3.5;
    case 'Very good':
      return 4.0;
    case 'Excellent':
      return 5.0;
    default:
      return 0;
  }
};

export const calculateGPA = (courses: Course[]): number => {
  let totalPoints = 0;
  let totalCredits = 0;

  courses.forEach(course => {
    if (!course) return; // Skip undefined courses

    // Skip pass/fail courses in GPA calculation
    if (!course.isPassFail && course.grade && course.grade !== 'Not finished' && course.grade !== 'Pass/Fail') {
      totalPoints += course.credits * getGradeValue(course.grade);
      totalCredits += course.credits;
    }
  });

  return totalCredits === 0 ? 0 : Number((totalPoints / totalCredits).toFixed(3)); // Updated to 3 decimal points
};

export const validateCredits = (courses: Course[]): boolean => {
  const totalCredits = courses.reduce((sum, course) => {
    if (!course) return sum; // Skip undefined courses
    return sum + course.credits;
  }, 0);
  return totalCredits <= 15;
};