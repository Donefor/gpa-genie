import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemesterTable } from './SemesterTable';
import { Year3Controls } from './Year3Controls';
import { calculateGPA } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { ElectiveSelect } from './ElectiveSelect';

interface Year3SectionProps {
  previousYearCourses?: Course[];
}

export const Year3Section = ({ previousYearCourses = [] }: Year3SectionProps) => {
  const [exchangeOption, setExchangeOption] = useState<'none' | 'fall' | 'spring'>('none');
  const [hasInternship, setHasInternship] = useState(false);
  const [thesisOption, setThesisOption] = useState<'none' | 'fall' | 'spring'>('none');
  const [electiveSemester1A, setElectiveSemester1A] = useState<ElectiveType>(null);
  const [electiveSemester1B, setElectiveSemester1B] = useState<ElectiveType>(null);
  const [electiveSemester2A, setElectiveSemester2A] = useState<ElectiveType>(null);
  const [electiveSemester2B, setElectiveSemester2B] = useState<ElectiveType>(null);
  const [electiveSemester3A, setElectiveSemester3A] = useState<ElectiveType>(null);
  const [electiveSemester3B, setElectiveSemester3B] = useState<ElectiveType>(null);
  const [electiveSemester4A, setElectiveSemester4A] = useState<ElectiveType>(null);
  const [electiveSemester4B, setElectiveSemester4B] = useState<ElectiveType>(null);
  const [semesters, setSemesters] = useState<{ courses: Course[] }[]>(
    Array(4).fill({ courses: [] })
  );
  const [gpa, setGpa] = useState(0);
  const isMobile = useIsMobile();

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

  useEffect(() => {
    const emptySemesters = Array(4).fill(null).map(() => ({ courses: [] }));
    
    setSemesters(() => {
      const updatedSemesters = [...emptySemesters];

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

      if (thesisOption === 'fall' && exchangeOption !== 'fall') {
        updatedSemesters[0].courses.push({ name: 'Thesis', credits: 7.5, grade: 'Not finished' });
        updatedSemesters[1].courses.push({ name: 'Thesis', credits: 7.5, grade: 'Not finished' });
      } else if (thesisOption === 'spring' && exchangeOption !== 'spring') {
        updatedSemesters[2].courses.push({ name: 'Thesis', credits: 7.5, grade: 'Not finished' });
        updatedSemesters[3].courses.push({ name: 'Thesis', credits: 7.5, grade: 'Not finished' });
      }

      if (hasInternship) {
        updatedSemesters[0].courses = [
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
        updatedSemesters[1].courses = [
          { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true }
        ];
      }

      if (!hasInternship && exchangeOption !== 'fall') {
        if (electiveSemester1A) {
          updatedSemesters[0].courses.push({
            name: `Elective Course (${electiveSemester1A})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester1A === 'Pass/Fail'
          });
        }
        if (electiveSemester1B) {
          updatedSemesters[0].courses.push({
            name: `Elective Course (${electiveSemester1B})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester1B === 'Pass/Fail'
          });
        }
        if (electiveSemester2A) {
          updatedSemesters[1].courses.push({
            name: `Elective Course (${electiveSemester2A})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester2A === 'Pass/Fail'
          });
        }
        if (electiveSemester2B) {
          updatedSemesters[1].courses.push({
            name: `Elective Course (${electiveSemester2B})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester2B === 'Pass/Fail'
          });
        }
      }

      if (exchangeOption !== 'spring') {
        if (electiveSemester3A) {
          updatedSemesters[2].courses.push({
            name: `Elective Course (${electiveSemester3A})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester3A === 'Pass/Fail'
          });
        }
        if (electiveSemester3B) {
          updatedSemesters[2].courses.push({
            name: `Elective Course (${electiveSemester3B})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester3B === 'Pass/Fail'
          });
        }
        if (electiveSemester4A) {
          updatedSemesters[3].courses.push({
            name: `Elective Course (${electiveSemester4A})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester4A === 'Pass/Fail'
          });
        }
        if (electiveSemester4B) {
          updatedSemesters[3].courses.push({
            name: `Elective Course (${electiveSemester4B})`,
            credits: 7.5,
            grade: 'Not finished',
            isPassFail: electiveSemester4B === 'Pass/Fail'
          });
        }
      }

      return updatedSemesters;
    });
  }, [
    exchangeOption, 
    hasInternship, 
    thesisOption, 
    electiveSemester1A, 
    electiveSemester1B, 
    electiveSemester2A, 
    electiveSemester2B,
    electiveSemester3A,
    electiveSemester3B,
    electiveSemester4A,
    electiveSemester4B
  ]);

  useEffect(() => {
    const allCourses = [
      ...previousYearCourses,
      ...semesters.flatMap(semester => semester.courses)
    ];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses]);

  const handleExchangeSelect = (value: 'none' | 'fall' | 'spring') => {
    setSemesters(Array(4).fill({ courses: [] }));
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
    setSemesters(Array(4).fill({ courses: [] }));
    setHasInternship(value);
    if (value) {
      setExchangeOption('none');
      setThesisOption('none');
    }
  };

  const handleThesisSelect = (value: 'none' | 'fall' | 'spring') => {
    setThesisOption(value);
  };

  return (
    <Card className="mb-8">
      <CardHeader className={`bg-secondary ${isMobile ? 'px-2' : ''}`}>
        <CardTitle className="text-2xl font-semibold">
          Third year
        </CardTitle>
      </CardHeader>
      <CardContent className={`pt-6 ${isMobile ? 'px-1' : ''}`}>
        <Card className={`mb-8 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
          <Year3Controls
            exchangeOption={exchangeOption}
            hasInternship={hasInternship}
            thesisOption={thesisOption}
            onExchangeChange={handleExchangeSelect}
            onInternshipChange={handleInternshipSelect}
            onThesisChange={handleThesisSelect}
          />
        </Card>

        {/* Semester 1 */}
        <div className="mb-8">
          <h3 className={`text-lg font-medium mb-4 ${isMobile ? 'px-2' : 'px-4'}`}>
            Semester 1
          </h3>
          <Card className={`mb-4 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
            <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">First Elective</span>
                  <ElectiveSelect
                    value={electiveSemester1A}
                    onChange={setElectiveSemester1A}
                    disabled={exchangeOption === 'fall' || hasInternship}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Second Elective</span>
                  <ElectiveSelect
                    value={electiveSemester1B}
                    onChange={setElectiveSemester1B}
                    disabled={exchangeOption === 'fall' || hasInternship}
                  />
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
        </div>

        {/* Semester 2 */}
        <div className="mb-8">
          <h3 className={`text-lg font-medium mb-4 ${isMobile ? 'px-2' : 'px-4'}`}>
            Semester 2
          </h3>
          <Card className={`mb-4 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
            <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">First Elective</span>
                  <ElectiveSelect
                    value={electiveSemester2A}
                    onChange={setElectiveSemester2A}
                    disabled={exchangeOption === 'fall' || hasInternship}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Second Elective</span>
                  <ElectiveSelect
                    value={electiveSemester2B}
                    onChange={setElectiveSemester2B}
                    disabled={exchangeOption === 'fall' || hasInternship}
                  />
                </div>
              </div>
            </div>
          </Card>
          <SemesterTable
            courses={semesters[1].courses}
            onGradeChange={(courseIndex, grade) => handleGradeChange(1, courseIndex, grade)}
            isThirdYear={true}
            semester={2}
          />
        </div>

        {/* Semesters 3 and 4 */}
        {[2, 3].map((semesterIndex) => (
          <div key={semesterIndex} className="mb-8">
            <h3 className={`text-lg font-medium mb-4 ${isMobile ? 'px-2' : 'px-4'}`}>
              Semester {semesterIndex + 1}
            </h3>
            <Card className={`mb-4 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
              <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
                <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                  <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                    <span className="block text-sm font-medium mb-2">First Elective</span>
                    <ElectiveSelect
                      value={semesterIndex === 2 ? electiveSemester3A : electiveSemester4A}
                      onChange={semesterIndex === 2 ? setElectiveSemester3A : setElectiveSemester4A}
                      disabled={exchangeOption === 'spring'}
                    />
                  </div>
                  <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                    <span className="block text-sm font-medium mb-2">Second Elective</span>
                    <ElectiveSelect
                      value={semesterIndex === 2 ? electiveSemester3B : electiveSemester4B}
                      onChange={semesterIndex === 2 ? setElectiveSemester3B : setElectiveSemester4B}
                      disabled={exchangeOption === 'spring'}
                    />
                  </div>
                </div>
              </div>
            </Card>
            <SemesterTable
              courses={semesters[semesterIndex].courses}
              onGradeChange={(courseIndex, grade) => handleGradeChange(semesterIndex, courseIndex, grade)}
              isThirdYear={true}
              semester={semesterIndex + 1}
            />
          </div>
        ))}

        <div className={`mt-6 w-full bg-muted ${isMobile ? 'p-2' : 'p-4'} rounded-lg shadow-sm`}>
          <Badge variant="secondary" className="text-lg px-4 py-1">
            Third Year: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
