
export type Grade = 'Not finished' | 'Pass' | 'Good' | 'Very good' | 'Excellent' | 'Pass/Fail' | null;

export type Course = {
  name: string;
  credits: number;
  grade: Grade;
  isPassFail?: boolean;
};

export type Semester = {
  courses: Course[];
};

export type Year = {
  semesters: Semester[];
  gpa: number;
};

export type Specialization = 
  | 'Economics'
  | 'Finance'
  | 'Accounting & Financial Management'
  | 'Marketing'
  | 'Management'
  | null;

export interface CourseData {
  name: string;
  credits: number;
}

export type ElectiveType = 'Graded' | 'Pass/Fail' | null;
