
import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SemesterTable } from './SemesterTable';
import { Year3Controls, ExchangeOption, ThesisOption } from './Year3Controls';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateGPA } from '@/utils/calculations';
import { ElectiveSelect } from './ElectiveSelect';
import { SpecializationSelect } from './SpecializationSelect';

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

  // New state for electives and specializations
  const [semester1Electives, setSemester1Electives] = useState<ElectiveType[]>([null, null]);
  const [semester2Electives, setSemester2Electives] = useState<ElectiveType[]>([null, null]);
  const [specialization1, setSpecialization1] = useState<Specialization>(null);
  const [specialization2, setSpecialization2] = useState<Specialization>(null);

  const handleGradeChange = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setSemesters(prev => {
      const newSemesters = [...prev];
      const course = newSemesters[semesterIndex].courses[courseIndex];
      
      if (course.name === 'Thesis') {
        return newSemesters.map(semester => ({
          courses: semester.courses.map(c => 
            c.name === 'Thesis' ? { ...c, grade } : c
          )
        }));
      }
      
      newSemesters[semesterIndex] = {
        courses: newSemesters[semesterIndex].courses.map((c, idx) =>
          idx === courseIndex ? { ...c, grade } : c
        )
      };
      return newSemesters;
    });
  };

  // Update semesters when options change
  useEffect(() => {
    const createEmptySemesters = () => Array(4).fill(null).map(() => ({ courses: [] }));
    let newSemesters = createEmptySemesters();

    // Handle Exchange courses - only if internship is not selected
    if (!hasInternship) {
      const exchangeCourse = { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true };

      if (exchangeOption === 'fall') {
        newSemesters[0].courses = [exchangeCourse, exchangeCourse];
        newSemesters[1].courses = [exchangeCourse, exchangeCourse];
      } else if (exchangeOption === 'spring') {
        newSemesters[2].courses = [exchangeCourse, exchangeCourse];
        newSemesters[3].courses = [exchangeCourse, exchangeCourse];
      }
    }

    // Handle Internship
    if (hasInternship) {
      newSemesters = createEmptySemesters();
      const internshipCourse = { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[0].courses = [internshipCourse];
      newSemesters[1].courses = [internshipCourse];
    }

    // Add electives for semesters 1 and 2 if no exchange/internship
    if (!hasInternship && exchangeOption === 'none') {
      semester1Electives.forEach((type, index) => {
        if (type) {
          newSemesters[0].courses.push({
            name: `Elective ${index + 1}`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: type === 'Pass/Fail'
          });
        }
      });

      semester2Electives.forEach((type, index) => {
        if (type) {
          newSemesters[1].courses.push({
            name: `Elective ${index + 1}`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: type === 'Pass/Fail'
          });
        }
      });
    }

    // Add specialization courses for semesters 3 and 4
    if (specialization1 && !hasInternship && exchangeOption !== 'spring') {
      const spec1Course = {
        name: `${specialization1} Specialization`,
        credits: 7.5,
        grade: 'Not finished'
      };
      newSemesters[2].courses.push(spec1Course);
      newSemesters[3].courses.push(spec1Course);
    }

    if (specialization2 && !hasInternship && exchangeOption !== 'spring') {
      const spec2Course = {
        name: `${specialization2} Specialization`,
        credits: 7.5,
        grade: 'Not finished'
      };
      newSemesters[2].courses.push(spec2Course);
      newSemesters[3].courses.push(spec2Course);
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
  }, [
    exchangeOption,
    hasInternship,
    thesisOption,
    semester1Electives,
    semester2Electives,
    specialization1,
    specialization2
  ]);

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

        {/* Electives selection for semesters 1 and 2 */}
        {!hasInternship && exchangeOption === 'none' && (
          <Card className={`mb-8 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
            <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Semester 1 Elective 1</span>
                  <ElectiveSelect
                    value={semester1Electives[0]}
                    onChange={(type) => {
                      const newElectives = [...semester1Electives];
                      newElectives[0] = type;
                      setSemester1Electives(newElectives);
                    }}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Semester 1 Elective 2</span>
                  <ElectiveSelect
                    value={semester1Electives[1]}
                    onChange={(type) => {
                      const newElectives = [...semester1Electives];
                      newElectives[1] = type;
                      setSemester1Electives(newElectives);
                    }}
                  />
                </div>
              </div>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Semester 2 Elective 1</span>
                  <ElectiveSelect
                    value={semester2Electives[0]}
                    onChange={(type) => {
                      const newElectives = [...semester2Electives];
                      newElectives[0] = type;
                      setSemester2Electives(newElectives);
                    }}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Semester 2 Elective 2</span>
                  <ElectiveSelect
                    value={semester2Electives[1]}
                    onChange={(type) => {
                      const newElectives = [...semester2Electives];
                      newElectives[1] = type;
                      setSemester2Electives(newElectives);
                    }}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Specialization selection for semesters 3 and 4 */}
        {!hasInternship && exchangeOption !== 'spring' && (
          <Card className={`mb-8 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
            <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">First Specialization</span>
                  <SpecializationSelect
                    value={specialization1}
                    onChange={setSpecialization1}
                    disabledOptions={specialization2 ? [specialization2] : []}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Second Specialization</span>
                  <SpecializationSelect
                    value={specialization2}
                    onChange={setSpecialization2}
                    disabled={!specialization1}
                    disabledOptions={specialization1 ? [specialization1] : []}
                  />
                </div>
              </div>
            </div>
          </Card>
        )}

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
