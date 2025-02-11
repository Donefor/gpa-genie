
import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SemesterTable } from './SemesterTable';
import { Year3Controls } from './Year3Controls';
import { useIsMobile } from '@/hooks/use-mobile';
import { calculateGPA } from '@/utils/calculations';
import { ElectiveSelect } from './ElectiveSelect';
import { SpecializationSelect } from './SpecializationSelect';

interface Year3SectionProps {
  previousYearCourses?: Course[];
}

export const Year3Section = ({ previousYearCourses = [] }: Year3SectionProps) => {
  const [exchangeOption, setExchangeOption] = useState<'none' | 'fall' | 'spring'>('none');
  const [hasInternship, setHasInternship] = useState(false);
  const [thesisOption, setThesisOption] = useState<'none' | 'fall' | 'spring'>('none');
  const [semesters, setSemesters] = useState<{ courses: Course[] }[]>(
    Array(4).fill({ courses: [] })
  );
  const [gpa, setGpa] = useState(0);
  const isMobile = useIsMobile();

  // State for electives and specializations
  const [semester1Electives, setSemester1Electives] = useState<ElectiveType[]>([null, null]);
  const [semester2Electives, setSemester2Electives] = useState<ElectiveType[]>([null, null]);
  const [specialization1, setSpecialization1] = useState<Specialization>(null);
  const [specialization2, setSpecialization2] = useState<Specialization>(null);

  const handleGradeChange = (semesterIndex: number, courseIndex: number, grade: Grade) => {
    setSemesters(prev => {
      const newSemesters = [...prev];
      if (newSemesters[semesterIndex].courses[courseIndex].name === 'Thesis') {
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
    let newSemesters = Array(4).fill(null).map(() => ({ courses: [] }));

    // Handle Exchange courses - overrides everything in the semester
    if (exchangeOption === 'fall') {
      const exchangeCourse = { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[0].courses = [exchangeCourse, exchangeCourse];
      newSemesters[1].courses = [exchangeCourse, exchangeCourse];
    } else if (exchangeOption === 'spring') {
      const exchangeCourse = { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[2].courses = [exchangeCourse, exchangeCourse];
      newSemesters[3].courses = [exchangeCourse, exchangeCourse];
    }

    // Handle Internship - overrides everything
    if (hasInternship) {
      newSemesters = Array(4).fill(null).map(() => ({ courses: [] }));
      const internshipCourse = { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[0].courses = [internshipCourse, internshipCourse];
      newSemesters[1].courses = [internshipCourse, internshipCourse];
      return setSemesters(newSemesters);
    }

    // Handle Thesis - takes priority over electives
    if (thesisOption === 'fall') {
      const thesisCourse = { name: 'Thesis', credits: 7.5, grade: 'Not finished' };
      if (newSemesters[0].courses.length < 2) {
        newSemesters[0].courses.push(thesisCourse);
      }
      if (newSemesters[1].courses.length < 2) {
        newSemesters[1].courses.push(thesisCourse);
      }
    } else if (thesisOption === 'spring') {
      const thesisCourse = { name: 'Thesis', credits: 7.5, grade: 'Not finished' };
      if (newSemesters[2].courses.length < 2) {
        newSemesters[2].courses.push(thesisCourse);
      }
      if (newSemesters[3].courses.length < 2) {
        newSemesters[3].courses.push(thesisCourse);
      }
    }

    // Add electives if space available (less than 15 ECTS)
    if (!hasInternship && exchangeOption === 'none') {
      [semester1Electives, semester2Electives].forEach((semesterElectives, semesterIndex) => {
        semesterElectives.forEach((type, index) => {
          if (type && newSemesters[semesterIndex].courses.length < 2) {
            newSemesters[semesterIndex].courses.push({
              name: `Elective ${index + 1}`,
              credits: 7.5,
              grade: 'Not finished',
              isPassFail: type === 'Pass/Fail'
            });
          }
        });
      });
    }

    // Add specialization courses if no exchange in spring
    if (!hasInternship && exchangeOption !== 'spring') {
      if (specialization1) {
        const spec1Course = {
          name: `${specialization1} Specialization`,
          credits: 7.5,
          grade: 'Not finished'
        };
        if (newSemesters[2].courses.length < 2) newSemesters[2].courses.push(spec1Course);
        if (newSemesters[3].courses.length < 2) newSemesters[3].courses.push(spec1Course);
      }

      if (specialization2) {
        const spec2Course = {
          name: `${specialization2} Specialization`,
          credits: 7.5,
          grade: 'Not finished'
        };
        if (newSemesters[2].courses.length < 2) newSemesters[2].courses.push(spec2Course);
        if (newSemesters[3].courses.length < 2) newSemesters[3].courses.push(spec2Course);
      }
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
      <CardHeader className="bg-secondary">
        <CardTitle className="text-2xl font-semibold">
          Third year
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Card className="mb-6 bg-gradient-to-r from-[#D3E4FD]/50 to-[#E5DEFF]/50 w-full">
          <CardContent className="p-6">
            <Year3Controls
              exchangeOption={exchangeOption}
              hasInternship={hasInternship}
              thesisOption={thesisOption}
              onExchangeChange={setExchangeOption}
              onInternshipChange={setHasInternship}
              onThesisChange={setThesisOption}
            />
          </CardContent>
        </Card>

        {/* Fall Semester Electives Menu */}
        {!hasInternship && exchangeOption === 'none' && (
          <div className="space-y-8">
            <Card className="mx-0 bg-gradient-to-r from-[#D3E4FD]/30 to-[#E5DEFF]/30 shadow-lg p-6 mb-8">
              <h3 className="text-xl font-semibold mb-6 text-[#1A1F2C]">Fall Semester</h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#403E43]">Semester 1</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 1</span>
                      <ElectiveSelect
                        value={semester1Electives[0]}
                        onChange={(type) => {
                          const newElectives = [...semester1Electives];
                          newElectives[0] = type;
                          setSemester1Electives(newElectives);
                        }}
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 2</span>
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
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#403E43]">Semester 2</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 1</span>
                      <ElectiveSelect
                        value={semester2Electives[0]}
                        onChange={(type) => {
                          const newElectives = [...semester2Electives];
                          newElectives[0] = type;
                          setSemester2Electives(newElectives);
                        }}
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 2</span>
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
              </div>
            </Card>

            <SemesterTable
              courses={semesters[0].courses}
              onGradeChange={(courseIndex, grade) => handleGradeChange(0, courseIndex, grade)}
              isThirdYear={true}
              semester={1}
            />
            <SemesterTable
              courses={semesters[1].courses}
              onGradeChange={(courseIndex, grade) => handleGradeChange(1, courseIndex, grade)}
              isThirdYear={true}
              semester={2}
            />
          </div>
        )}

        {/* Spring Semester Section with Specializations */}
        {!hasInternship && exchangeOption !== 'spring' && (
          <div className="space-y-8 mt-8">
            <Card className="mx-0 bg-gradient-to-r from-[#D3E4FD]/30 to-[#E5DEFF]/30 shadow-lg p-6">
              <h3 className="text-xl font-semibold mb-6 text-[#1A1F2C]">Spring Semester</h3>
              <div className="grid md:grid-cols-3 gap-8">
                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#403E43]">Specializations</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium mb-2">First Specialization</span>
                      <SpecializationSelect
                        value={specialization1}
                        onChange={setSpecialization1}
                        disabledOptions={specialization2 ? [specialization2] : []}
                      />
                    </div>
                    <div>
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

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#403E43]">Term 3 Electives</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 1</span>
                      <ElectiveSelect
                        value={semester1Electives[0]}
                        onChange={(type) => {
                          const newElectives = [...semester1Electives];
                          newElectives[0] = type;
                          setSemester1Electives(newElectives);
                        }}
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 2</span>
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
                </div>

                <div className="space-y-4">
                  <h4 className="text-lg font-medium text-[#403E43]">Term 4 Electives</h4>
                  <div className="space-y-4">
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 1</span>
                      <ElectiveSelect
                        value={semester2Electives[0]}
                        onChange={(type) => {
                          const newElectives = [...semester2Electives];
                          newElectives[0] = type;
                          setSemester2Electives(newElectives);
                        }}
                      />
                    </div>
                    <div>
                      <span className="block text-sm font-medium mb-2">Elective 2</span>
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
              </div>
            </Card>

            <SemesterTable
              courses={semesters[2].courses}
              onGradeChange={(courseIndex, grade) => handleGradeChange(2, courseIndex, grade)}
              isThirdYear={true}
              semester={3}
            />
            <SemesterTable
              courses={semesters[3].courses}
              onGradeChange={(courseIndex, grade) => handleGradeChange(3, courseIndex, grade)}
              isThirdYear={true}
              semester={4}
            />
          </div>
        )}

        <div className="mt-6 w-full bg-gradient-to-r from-[#D3E4FD]/50 to-[#E5DEFF]/50 p-4 rounded-lg shadow-sm">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Third year GPA: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
