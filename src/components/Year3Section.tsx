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
    setSemesters((prevSemesters) => {
      // Create a deep copy of the existing semesters to preserve previous state
      const emptySemesters = Array(4).fill(null).map(() => ({ courses: [] }));
      const updatedSemesters = [...emptySemesters];
      
      // Helper function to find an existing course in the previous state
      const findExistingCourse = (semesterIndex, courseName, courseType, courseIndex = 0) => {
        if (!prevSemesters || !prevSemesters[semesterIndex] || !prevSemesters[semesterIndex].courses) {
          return null;
        }
        
        // Filter courses by name and ensure we're only matching the same course type
        // This ensures we don't accidentally convert internships to electives
        const matchingCourses = prevSemesters[semesterIndex].courses.filter(
          course => course.name === courseName && 
                  // For electives, ensure we're not matching a former internship course
                  (courseName !== 'Elective Course' || course.wasInternship !== true)
        );
        
        // Return the course at the specific index among matching courses, if it exists
        return matchingCourses.length > courseIndex ? matchingCourses[courseIndex] : null;
      };
  
      // Add exchange courses if selected
      if (exchangeOption === 'fall') {
        // Add first exchange course for semester 1
        const exchange1A = findExistingCourse(0, 'Exchange', 'exchange', 0);
        updatedSemesters[0].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange1A ? exchange1A.grade : 'Not finished', 
          isPassFail: true 
        });
        
        // Add second exchange course for semester 1
        const exchange1B = findExistingCourse(0, 'Exchange', 'exchange', 1);
        updatedSemesters[0].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange1B ? exchange1B.grade : 'Not finished', 
          isPassFail: true 
        });
        
        // Add first exchange course for semester 2
        const exchange2A = findExistingCourse(1, 'Exchange', 'exchange', 0);
        updatedSemesters[1].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange2A ? exchange2A.grade : 'Not finished', 
          isPassFail: true 
        });
        
        // Add second exchange course for semester 2
        const exchange2B = findExistingCourse(1, 'Exchange', 'exchange', 1);
        updatedSemesters[1].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange2B ? exchange2B.grade : 'Not finished', 
          isPassFail: true 
        });
      } else if (exchangeOption === 'spring') {
        // Add first exchange course for semester 3
        const exchange3A = findExistingCourse(2, 'Exchange', 'exchange', 0);
        updatedSemesters[2].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange3A ? exchange3A.grade : 'Not finished', 
          isPassFail: true 
        });
        
        // Add second exchange course for semester 3
        const exchange3B = findExistingCourse(2, 'Exchange', 'exchange', 1);
        updatedSemesters[2].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange3B ? exchange3B.grade : 'Not finished', 
          isPassFail: true 
        });
        
        // Add first exchange course for semester 4
        const exchange4A = findExistingCourse(3, 'Exchange', 'exchange', 0);
        updatedSemesters[3].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange4A ? exchange4A.grade : 'Not finished', 
          isPassFail: true 
        });
        
        // Add second exchange course for semester 4
        const exchange4B = findExistingCourse(3, 'Exchange', 'exchange', 1);
        updatedSemesters[3].courses.push({ 
          name: 'Exchange', 
          credits: 7.5, 
          grade: exchange4B ? exchange4B.grade : 'Not finished', 
          isPassFail: true 
        });
      }
  
      // Add thesis courses if selected
      if (thesisOption === 'fall' && exchangeOption !== 'fall') {
        const thesis1 = findExistingCourse(0, 'Thesis', 'thesis');
        updatedSemesters[0].courses.push({ 
          name: 'Thesis', 
          credits: 7.5, 
          grade: thesis1 ? thesis1.grade : 'Not finished'
        });
        
        const thesis2 = findExistingCourse(1, 'Thesis', 'thesis');
        updatedSemesters[1].courses.push({ 
          name: 'Thesis', 
          credits: 7.5, 
          grade: thesis2 ? thesis2.grade : 'Not finished'
        });
      } else if (thesisOption === 'spring' && exchangeOption !== 'spring') {
        const thesis3 = findExistingCourse(2, 'Thesis', 'thesis');
        updatedSemesters[2].courses.push({ 
          name: 'Thesis', 
          credits: 7.5, 
          grade: thesis3 ? thesis3.grade : 'Not finished'
        });
        
        const thesis4 = findExistingCourse(3, 'Thesis', 'thesis');
        updatedSemesters[3].courses.push({ 
          name: 'Thesis', 
          credits: 7.5, 
          grade: thesis4 ? thesis4.grade : 'Not finished'
        });
      }
  
      // Add internship courses if selected
      if (hasInternship) {
        const internship1 = findExistingCourse(0, 'Internship', 'internship');
        updatedSemesters[0].courses.push({ 
          name: 'Internship', 
          credits: 7.5, 
          grade: internship1 ? internship1.grade : 'Not finished', 
          isPassFail: true,
          courseType: 'internship' // Add a type identifier
        });
        
        const internship2 = findExistingCourse(1, 'Internship', 'internship');
        updatedSemesters[1].courses.push({ 
          name: 'Internship', 
          credits: 7.5, 
          grade: internship2 ? internship2.grade : 'Not finished', 
          isPassFail: true,
          courseType: 'internship' // Add a type identifier
        });
      }
  
      // Helper function to count only true electives (not former internships)
      const getElectiveCount = (semesterIndex) => {
        if (!prevSemesters || !prevSemesters[semesterIndex]) return 0;
        return prevSemesters[semesterIndex].courses.filter(
          course => course.name === 'Elective Course' && course.wasInternship !== true
        ).length;
      };
  
      let electiveIndices = [0, 0, 0, 0]; // Track elective indices for each semester
  
      // Add electives if not on exchange
      if (exchangeOption !== 'fall') {
        if (electiveSemester1A) {
          const electiveIndex = electiveIndices[0]++;
          const existingElective = electiveIndex < getElectiveCount(0) ? 
            findExistingCourse(0, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[0].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester1A === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
        
        if (electiveSemester1B) {
          const electiveIndex = electiveIndices[0]++;
          const existingElective = electiveIndex < getElectiveCount(0) ? 
            findExistingCourse(0, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[0].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester1B === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
        
        if (electiveSemester2A) {
          const electiveIndex = electiveIndices[1]++;
          const existingElective = electiveIndex < getElectiveCount(1) ? 
            findExistingCourse(1, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[1].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester2A === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
        
        if (electiveSemester2B) {
          const electiveIndex = electiveIndices[1]++;
          const existingElective = electiveIndex < getElectiveCount(1) ? 
            findExistingCourse(1, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[1].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester2B === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
      }
  
      if (exchangeOption !== 'spring') {
        if (electiveSemester3A) {
          const electiveIndex = electiveIndices[2]++;
          const existingElective = electiveIndex < getElectiveCount(2) ? 
            findExistingCourse(2, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[2].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester3A === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
        
        if (electiveSemester3B) {
          const electiveIndex = electiveIndices[2]++;
          const existingElective = electiveIndex < getElectiveCount(2) ? 
            findExistingCourse(2, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[2].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester3B === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
        
        if (electiveSemester4A) {
          const electiveIndex = electiveIndices[3]++;
          const existingElective = electiveIndex < getElectiveCount(3) ? 
            findExistingCourse(3, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[3].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester4A === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
          });
        }
        
        if (electiveSemester4B) {
          const electiveIndex = electiveIndices[3]++;
          const existingElective = electiveIndex < getElectiveCount(3) ? 
            findExistingCourse(3, 'Elective Course', 'elective', electiveIndex) : null;
            
          updatedSemesters[3].courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: existingElective ? existingElective.grade : 'Not finished',
            isPassFail: electiveSemester4B === 'Pass/Fail',
            courseType: 'elective' // Add a type identifier
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
    setHasInternship(value);
    if (value) {
      setExchangeOption('none');
    }
  };

  const handleThesisSelect = (value: 'none' | 'fall' | 'spring') => {
    setThesisOption(value);
  };

  return (
    <Card className="mb-8">
      <CardHeader className={`bg-secondary ${isMobile ? 'px-2' : ''}`}>
        <CardTitle className="text-2xl font-semibold">
          Third Year
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
            First Period
          </h3>
          <Card className={`mb-4 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
            <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">First Elective</span>
                  <ElectiveSelect
                    value={electiveSemester1A}
                    onChange={setElectiveSemester1A}
                    disabled={exchangeOption === 'fall'}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Second Elective</span>
                  <ElectiveSelect
                    value={electiveSemester1B}
                    onChange={setElectiveSemester1B}
                    disabled={exchangeOption === 'fall'}
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
            Second Period
          </h3>
          <Card className={`mb-4 ${isMobile ? 'mx-1' : 'mx-4'} bg-muted shadow-sm p-4`}>
            <div className={`space-y-6 ${isMobile ? "flex flex-col" : ""}`}>
              <div className={`${isMobile ? "flex flex-col space-y-4" : "flex items-start space-x-8"}`}>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">First Elective</span>
                  <ElectiveSelect
                    value={electiveSemester2A}
                    onChange={setElectiveSemester2A}
                    disabled={exchangeOption === 'fall'}
                  />
                </div>
                <div className={`${isMobile ? "w-full" : "flex-1"}`}>
                  <span className="block text-sm font-medium mb-2">Second Elective</span>
                  <ElectiveSelect
                    value={electiveSemester2B}
                    onChange={setElectiveSemester2B}
                    disabled={exchangeOption === 'fall'}
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
            {semesterIndex === 2 ? "Third Period" : semesterIndex === 3 ? "Fourth Period" : `Semester ${semesterIndex + 1}`}
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
            Third Year GPA: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

