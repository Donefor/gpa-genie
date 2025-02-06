
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

  const handleGradeChange = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setSemesters(prev => {
      const newSemesters = [...prev];
      const course = newSemesters[semesterIndex].courses[courseIndex];
      
      if (course.name === 'Thesis') {
        // If it's a thesis course, update all thesis courses across semesters
        return newSemesters.map(semester => ({
          courses: semester.courses.map(c => 
            c.name === 'Thesis' ? { ...c, grade } : c
          )
        }));
      }
      
      // For non-thesis courses, just update the specific course
      newSemesters[semesterIndex] = {
        courses: newSemesters[semesterIndex].courses.map((c, idx) =>
          idx === courseIndex ? { ...c, grade } : c
        )
      };
      return newSemesters;
    });
  };

  // Update semesters when exchange, internship, or thesis options change
  useEffect(() => {
    const createEmptySemesters = () => Array(4).fill(null).map(() => ({ courses: [] }));

    // Start with clean semesters
    let newSemesters = createEmptySemesters();

    // Handle Exchange courses - only if internship is not selected
    if (!hasInternship) {
      const exchangeCourse = { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true };

      if (exchangeOption === 'fall') {
        // Add exchange courses to fall semesters
        newSemesters[0].courses = [exchangeCourse, exchangeCourse];
        newSemesters[1].courses = [exchangeCourse, exchangeCourse];
      } else if (exchangeOption === 'spring') {
        // Add exchange courses to spring semesters
        newSemesters[2].courses = [exchangeCourse, exchangeCourse];
        newSemesters[3].courses = [exchangeCourse, exchangeCourse];
      } else {
        // If no exchange option is selected, ensure all exchange courses are removed
        newSemesters.forEach(semester => {
          semester.courses = semester.courses.filter(course => course.name !== 'Exchange');
        });
      }
    }

    // Handle Internship (clears any exchange courses)
    if (hasInternship) {
      newSemesters = createEmptySemesters(); // Reset all semesters
      const internshipCourse = { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[0].courses = [internshipCourse];
      newSemesters[1].courses = [internshipCourse];
    }

    // Handle Thesis
    if (thesisOption === 'fall') {
      const thesisCourse = { name: 'Thesis', credits: 7.5, grade: 'Not finished' };
      newSemesters[0].courses.push(thesisCourse);
      newSemesters[1].courses.push(thesisCourse);
    } else if (thesisOption === 'spring') {
      const thesisCourse = { name: 'Thesis', credits: 7.5, grade: 'Not finished' };
      newSemesters[2].courses.push(thesisCourse);
      newSemesters[3].courses.push(thesisCourse);
    }

    setSemesters(newSemesters);
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

