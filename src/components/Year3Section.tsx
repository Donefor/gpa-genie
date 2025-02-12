
import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemesterTable } from './SemesterTable';
import { Year3Controls } from './Year3Controls';
import { calculateGPA } from '@/utils/calculations';
import { ElectiveSelect } from './ElectiveSelect';
import { SpecializationSelect } from './SpecializationSelect';
import { Badge } from '@/components/ui/badge';

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

  // State for electives and specializations
  const [semester1Electives, setSemester1Electives] = useState<ElectiveType[]>([null, null]);
  const [semester2Electives, setSemester2Electives] = useState<ElectiveType[]>([null, null]);
  const [semester3Electives, setSemester3Electives] = useState<ElectiveType[]>([null, null]);
  const [semester4Electives, setSemester4Electives] = useState<ElectiveType[]>([null, null]);
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

  const handleExchangeSelect = (value: 'none' | 'fall' | 'spring') => {
    setExchangeOption(value);
    if (value === 'fall') {
      setThesisOption('spring');
    } else if (value === 'spring') {
      setThesisOption('fall');
    } else {
      setThesisOption('none');
    }
    if (value !== 'none') {
      setHasInternship(false);
    }
  };

  const handleInternshipSelect = (value: boolean) => {
    setHasInternship(value);
    if (value) {
      setExchangeOption('none');
      setThesisOption('none');
    }
  };

  const handleThesisSelect = (value: 'none' | 'fall' | 'spring') => {
    setThesisOption(value);
  };

  // Update semesters when options change
  useEffect(() => {
    setSemesters(prev => {
      const updatedSemesters = Array(4).fill(null).map(() => ({ courses: [] }));

      // Helper function to filter out special courses
      const filterSpecialCourses = (courses: Course[]) =>
        courses.filter(course => 
          !['Exchange', 'Thesis', 'Internship'].includes(course.name)
        );

      // Start with existing courses minus special courses
      prev.forEach((semester, index) => {
        updatedSemesters[index].courses = filterSpecialCourses(semester.courses);
      });

      // Add Exchange courses
      if (exchangeOption === 'fall') {
        updatedSemesters[0].courses = [
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
        updatedSemesters[1].courses = [
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
      } else if (exchangeOption === 'spring') {
        updatedSemesters[2].courses = [
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
        updatedSemesters[3].courses = [
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
      }

      // Add Thesis
      if (thesisOption === 'fall') {
        updatedSemesters[0].courses = [
          ...updatedSemesters[0].courses,
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        ];
        updatedSemesters[1].courses = [
          ...updatedSemesters[1].courses,
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        ];
      } else if (thesisOption === 'spring') {
        updatedSemesters[2].courses = [
          ...updatedSemesters[2].courses,
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        ];
        updatedSemesters[3].courses = [
          ...updatedSemesters[3].courses,
          { name: 'Thesis', credits: 7.5, grade: 'Not finished' }
        ];
      }

      // Add Internship (overrides everything)
      if (hasInternship) {
        updatedSemesters[0].courses = [
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
        updatedSemesters[1].courses = [
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true },
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
      }

      return updatedSemesters;
    });
  }, [exchangeOption, hasInternship, thesisOption]);

  // Calculate GPA including all years
  useEffect(() => {
    const allCourses = [
      ...previousYearCourses,
      ...semesters.flatMap(semester => semester.courses)
    ];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses]);

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          Third year
        </CardTitle>
        <Badge variant="secondary" className="text-xl px-6 py-2">
          Year 3 GPA: {gpa.toFixed(2)}
        </Badge>
      </CardHeader>
      <CardContent className="pt-6">
        <Card className="mb-6 bg-gradient-to-r from-[#D3E4FD]/50 to-[#E5DEFF]/50 w-full">
          <CardContent className="p-6">
            <Year3Controls
              exchangeOption={exchangeOption}
              hasInternship={hasInternship}
              thesisOption={thesisOption}
              onExchangeChange={handleExchangeSelect}
              onInternshipChange={handleInternshipSelect}
              onThesisChange={handleThesisSelect}
            />
          </CardContent>
        </Card>

        {/* Fall Semester */}
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
                      disabled={exchangeOption === 'fall' || hasInternship}
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
                      disabled={exchangeOption === 'fall' || hasInternship}
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
                      disabled={exchangeOption === 'fall' || hasInternship}
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
                      disabled={exchangeOption === 'fall' || hasInternship}
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

        {/* Spring Semester */}
        <div className="space-y-8 mt-8">
          <Card className="mx-0 bg-gradient-to-r from-[#D3E4FD]/30 to-[#E5DEFF]/30 shadow-lg p-6">
            <h3 className="text-xl font-semibold mb-6 text-[#1A1F2C]">Spring Semester</h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-[#403E43]">Semester 3</h4>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium mb-2">Elective 1</span>
                    <ElectiveSelect
                      value={semester3Electives[0]}
                      onChange={(type) => {
                        const newElectives = [...semester3Electives];
                        newElectives[0] = type;
                        setSemester3Electives(newElectives);
                      }}
                      disabled={exchangeOption === 'spring' || hasInternship}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium mb-2">Elective 2</span>
                    <ElectiveSelect
                      value={semester3Electives[1]}
                      onChange={(type) => {
                        const newElectives = [...semester3Electives];
                        newElectives[1] = type;
                        setSemester3Electives(newElectives);
                      }}
                      disabled={exchangeOption === 'spring' || hasInternship}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-[#403E43]">Semester 4</h4>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium mb-2">Elective 1</span>
                    <ElectiveSelect
                      value={semester4Electives[0]}
                      onChange={(type) => {
                        const newElectives = [...semester4Electives];
                        newElectives[0] = type;
                        setSemester4Electives(newElectives);
                      }}
                      disabled={exchangeOption === 'spring' || hasInternship}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium mb-2">Elective 2</span>
                    <ElectiveSelect
                      value={semester4Electives[1]}
                      onChange={(type) => {
                        const newElectives = [...semester4Electives];
                        newElectives[1] = type;
                        setSemester4Electives(newElectives);
                      }}
                      disabled={exchangeOption === 'spring' || hasInternship}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg font-medium text-[#403E43]">Specializations</h4>
                <div className="space-y-4">
                  <div>
                    <span className="block text-sm font-medium mb-2">Specialization 1</span>
                    <SpecializationSelect
                      value={specialization1}
                      onChange={setSpecialization1}
                      disabled={exchangeOption === 'spring' || hasInternship}
                    />
                  </div>
                  <div>
                    <span className="block text-sm font-medium mb-2">Specialization 2</span>
                    <SpecializationSelect
                      value={specialization2}
                      onChange={setSpecialization2}
                      disabled={exchangeOption === 'spring' || hasInternship}
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
      </CardContent>
    </Card>
  );
};
