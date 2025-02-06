
import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { SemesterTable } from './SemesterTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateGPA } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';

interface YearSectionProps {
  yearNumber: number;
  semesters: { courses: Course[] }[];
  onGradeChange: (semesterIndex: number, courseIndex: number, grade: Grade) => void;
  isThirdYear?: boolean;
  specialization?: Specialization;
  secondSpecialization?: Specialization;
  electiveType?: ElectiveType;
  onSpecializationChange?: (spec: Specialization) => void;
  onSecondSpecializationChange?: (spec: Specialization) => void;
  onElectiveTypeChange?: (type: ElectiveType) => void;
  previousYearCourses?: Course[];
}

export const YearSection = ({ 
  yearNumber, 
  semesters, 
  onGradeChange, 
  isThirdYear,
  specialization,
  secondSpecialization,
  electiveType,
  onSpecializationChange,
  onSecondSpecializationChange,
  onElectiveTypeChange,
  previousYearCourses = [] 
}: YearSectionProps) => {
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    const allCourses = [...previousYearCourses, ...semesters.flatMap(semester => semester.courses)];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses, JSON.stringify(semesters)]);

  const getYearLabel = (year: number) => {
    switch (year) {
      case 1:
        return "First year GPA";
      case 2:
        return "Second year GPA";
      case 3:
        return "Third year GPA";
      default:
        return `Year ${year} GPA`;
    }
  };

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className={`${yearNumber === 2 ? 'bg-secondary w-full' : 'bg-secondary'}`}>
        <CardTitle className="text-2xl font-semibold">
          {yearNumber === 1 ? "First year" : yearNumber === 2 ? "Second year" : `Year ${yearNumber}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {semesters.map((semester, semesterIndex) => (
          <div key={semesterIndex} className="mb-8 last:mb-0">
            <h3 className="text-lg font-medium mb-4">Semester {semesterIndex + 1}</h3>
            <SemesterTable
              courses={semester.courses}
              onGradeChange={(courseIndex, grade) => 
                onGradeChange(semesterIndex, courseIndex, grade)
              }
              isThirdYear={isThirdYear}
              semester={semesterIndex + 1}
              specialization={specialization}
              secondSpecialization={secondSpecialization}
              electiveType={electiveType}
              onSpecializationChange={onSpecializationChange}
              onSecondSpecializationChange={onSecondSpecializationChange}
              onElectiveTypeChange={onElectiveTypeChange}
            />
          </div>
        ))}
        <div className="mt-6 w-full bg-secondary p-4">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {getYearLabel(yearNumber)}: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
