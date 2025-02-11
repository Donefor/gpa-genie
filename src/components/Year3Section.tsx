
import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SemesterTable } from './SemesterTable';
import { Year3Controls } from './Year3Controls';
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

  // Update semesters when options change
  useEffect(() => {
    // Start with a clean slate - initialize empty semesters
    let newSemesters = Array(4).fill(null).map(() => ({ courses: [] }));

    // Handle Internship - overrides everything
    if (hasInternship) {
      const internshipCourse = { name: 'Internship', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[0].courses = [internshipCourse, internshipCourse];
      newSemesters[1].courses = [internshipCourse, internshipCourse];
      setSemesters(newSemesters);
      return;
    }

    // Handle Exchange courses based on selected option
    if (exchangeOption === 'fall') {
      const exchangeCourse = { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[0].courses = [exchangeCourse, exchangeCourse];
      newSemesters[1].courses = [exchangeCourse, exchangeCourse];
    } else if (exchangeOption === 'spring') {
      const exchangeCourse = { name: 'Exchange', credits: 7.5, grade: 'Not finished', isPassFail: true };
      newSemesters[2].courses = [exchangeCourse, exchangeCourse];
      newSemesters[3].courses = [exchangeCourse, exchangeCourse];
    }

    // Handle Thesis only if there's no exchange in the same semester
    if (thesisOption === 'fall' && exchangeOption !== 'fall') {
      const thesisCourse = { name: 'Thesis', credits: 7.5, grade: 'Not finished' };
      newSemesters[0].courses = [...(newSemesters[0].courses || []), thesisCourse];
      newSemesters[1].courses = [...(newSemesters[1].courses || []), thesisCourse];
    } else if (thesisOption === 'spring' && exchangeOption !== 'spring') {
      const thesisCourse = { name: 'Thesis', credits: 7.5, grade: 'Not finished' };
      newSemesters[2].courses = [...(newSemesters[2].courses || []), thesisCourse];
      newSemesters[3].courses = [...(newSemesters[3].courses || []), thesisCourse];
    }

    // Add electives for semesters that don't have exchange courses
    const electivesBySemester = [
      { electives: semester1Electives, index: 0 },
      { electives: semester2Electives, index: 1 },
      { electives: semester3Electives, index: 2 },
      { electives: semester4Electives, index: 3 }
    ];

    electivesBySemester.forEach(({ electives, index }) => {
      const isExchangeSemester = 
        (exchangeOption === 'fall' && index <= 1) || 
        (exchangeOption === 'spring' && index >= 2);

      if (!isExchangeSemester && !hasInternship) {
        electives.forEach((type, electiveIndex) => {
          if (type && newSemesters[index].courses.length < 2) {
            newSemesters[index].courses.push({
              name: `Elective ${electiveIndex + 1}`,
              credits: 7.5,
              grade: 'Not finished',
              isPassFail: type === 'Pass/Fail'
            });
          }
        });
      }
    });

    // Add specialization courses for spring semester if no exchange
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
    semester3Electives,
    semester4Electives,
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
      <CardHeader>
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

        {/* Spring Semester Section with Electives and Specializations */}
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
