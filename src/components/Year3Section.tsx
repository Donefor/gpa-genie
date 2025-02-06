
import { useState, useEffect } from 'react';
import { Course, Grade } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SemesterTable } from './SemesterTable';
import { Year3Controls, ExchangeOption, ThesisOption } from './Year3Controls';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateGPA } from '@/utils/calculations';

interface Year3SectionProps {
  previousYearCourses?: Course[];
}

export const Year3Section = ({ previousYearCourses = [] }: Year3SectionProps) => {
  const [exchangeOption, setExchangeOption] = useState<ExchangeOption>('none');
  const [hasInternship, setHasInternship] = useState(false);
  const [thesisOption, setThesisOption] = useState<ThesisOption>('none');
  const [semesters, setSemesters] = useState<{ courses: Course[] }[]>(
    Array(4).fill({ courses: [] })
  );
  const [gpa, setGpa] = useState(0);
  const isMobile = useIsMobile();

  const updateThesisGrade = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setSemesters(prev => {
      const newSemesters = [...prev];
      const targetSemesters = thesisOption === 'fall' ? [0, 1] : [2, 3];
      
      targetSemesters.forEach(semesterIdx => {
        const courseIdx = newSemesters[semesterIdx].courses.findIndex(
          course => course.name === 'Thesis'
        );
        if (courseIdx !== -1) {
          newSemesters[semesterIdx] = {
            courses: newSemesters[semesterIdx].courses.map((course, idx) =>
              course.name === 'Thesis' ? { ...course, grade } : course
            )
          };
        }
      });
      
      return newSemesters;
    });
  };

  const handleGradeChange = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setSemesters(prev => {
      const newSemesters = [...prev];
      const course = newSemesters[semesterIndex].courses[courseIndex];
      
      if (course.name === 'Thesis') {
        updateThesisGrade(semesterIndex, courseIndex, grade);
        return newSemesters;
      }
      
      newSemesters[semesterIndex] = {
        courses: newSemesters[semesterIndex].courses.map((course, idx) =>
          idx === courseIndex ? { ...course, grade } : course
        )
      };
      return newSemesters;
    });
  };

  // Update semesters when exchange, internship, or thesis options change
  useEffect(() => {
    setSemesters(prev => {
      const newSemesters = Array(4).fill(null).map(() => ({ courses: [] }));

      // Handle Exchange
      if (exchangeOption === 'fall') {
        newSemesters[0].courses.push(
          { name: 'Exchange Course 1', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange Course 2', credits: 7.5, grade: 'Not finished', isPassFail: true }
        );
        newSemesters[1].courses.push(
          { name: 'Exchange Course 1', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange Course 2', credits: 7.5, grade: 'Not finished', isPassFail: true }
        );
      } else if (exchangeOption === 'spring') {
        newSemesters[2].courses.push(
          { name: 'Exchange Course 1', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange Course 2', credits: 7.5, grade: 'Not finished', isPassFail: true }
        );
        newSemesters[3].courses.push(
          { name: 'Exchange Course 1', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange Course 2', credits: 7.5, grade: 'Not finished', isPassFail: true }
        );
      }

      // Handle Internship
      if (hasInternship) {
        newSemesters[2].courses = [
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
        newSemesters[3].courses = [
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
      }

      // Handle Thesis
      if (thesisOption === 'fall') {
        newSemesters[0].courses.push(
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        );
        newSemesters[1].courses.push(
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        );
      } else if (thesisOption === 'spring') {
        newSemesters[2].courses.push(
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        );
        newSemesters[3].courses.push(
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        );
      }

      return newSemesters;
    });
  }, [exchangeOption, hasInternship, thesisOption]);

  // Calculate GPA
  useEffect(() => {
    const allCourses = [...previousYearCourses, ...semesters.flatMap(semester => semester.courses)];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses]);

  return (
    <Card className="mb-8">
      <CardHeader className={`bg-secondary ${isMobile ? 'px-2' : ''}`}>
        <CardTitle className="text-2xl font-semibold">
          Third year
        </CardTitle>
      </CardHeader>
      <CardContent className={`pt-6 ${isMobile ? 'px-1' : ''}`}>
        <Year3Controls
          exchangeOption={exchangeOption}
          hasInternship={hasInternship}
          thesisOption={thesisOption}
          onExchangeChange={setExchangeOption}
          onInternshipChange={setHasInternship}
          onThesisChange={setThesisOption}
        />

        {semesters.map((semester, index) => (
          <div key={index} className="mb-8">
            <h3 className={`text-lg font-medium mb-4 ${isMobile ? 'px-2' : 'px-4'}`}>
              Semester {index + 1}
            </h3>
            <SemesterTable
              courses={semester.courses}
              onGradeChange={(courseIndex, grade) => 
                handleGradeChange(index, courseIndex, grade)
              }
              isThirdYear={true}
              semester={index + 1}
            />
          </div>
        ))}

        <div className={`mt-6 w-full bg-muted ${isMobile ? 'p-2' : 'p-4'} rounded-lg shadow-sm`}>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Third year GPA: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
