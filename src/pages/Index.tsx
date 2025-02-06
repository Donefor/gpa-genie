
import { useState } from 'react';
import { YearSection } from '@/components/YearSection';
import { YEAR_1_COURSES, YEAR_2_COURSES } from '@/data/courseData';
import { Course, Grade } from '@/types';
import { calculateGPA } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';

const Index = () => {
  const [year1Data, setYear1Data] = useState({
    semesters: Object.values(YEAR_1_COURSES).map(courses => ({
      courses: courses.map(course => ({ ...course, grade: 'Not finished' as Grade }))
    }))
  });

  const [year2Data, setYear2Data] = useState({
    semesters: Object.values(YEAR_2_COURSES).map(courses => ({
      courses: courses.map(course => ({ ...course, grade: 'Not finished' as Grade }))
    }))
  });

  const handleYear1GradeChange = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setYear1Data(prev => {
      const newData = { ...prev };
      newData.semesters[semesterIndex].courses[courseIndex].grade = grade;
      return newData;
    });
  };

  const handleYear2GradeChange = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setYear2Data(prev => {
      const newData = { ...prev };
      newData.semesters[semesterIndex].courses[courseIndex].grade = grade;
      return newData;
    });
  };

  const calculateCumulativeGPA = () => {
    const allCourses: Course[] = [
      ...year1Data.semesters.flatMap(s => s.courses),
      ...year2Data.semesters.flatMap(s => s.courses)
    ];
    return calculateGPA(allCourses);
  };

  const year1Courses = year1Data.semesters.flatMap(s => s.courses);

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SSE GPA Calculator</h1>
          <p className="text-lg text-gray-600 mb-6">
            Calculate your GPA based on course performance
          </p>
          <Badge variant="secondary" className="text-xl px-6 py-2">
            Cumulative GPA: {calculateCumulativeGPA().toFixed(2)}
          </Badge>
        </div>

        <div className="space-y-8">
          <YearSection
            yearNumber={1}
            semesters={year1Data.semesters}
            onGradeChange={handleYear1GradeChange}
          />
          <YearSection
            yearNumber={2}
            semesters={year2Data.semesters}
            onGradeChange={handleYear2GradeChange}
            previousYearCourses={year1Courses}
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
