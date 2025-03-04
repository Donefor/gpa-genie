
import { useState } from 'react';
import { YearSection } from '@/components/YearSection';
import { YEAR_1_COURSES, YEAR_2_COURSES, SPECIALIZATION_COURSES } from '@/data/courseData';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { calculateGPA } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';
import { Year3Section } from '@/components/Year3Section';

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

  const [specialization, setSpecialization] = useState<Specialization>(null);
  const [secondSpecialization, setSecondSpecialization] = useState<Specialization>(null);
  const [electiveSemester3, setElectiveSemester3] = useState<ElectiveType>(null);
  const [electiveSemester4, setElectiveSemester4] = useState<ElectiveType>(null);

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

  const handleSpecializationChange = (spec: Specialization) => {
    setSecondSpecialization(null);
    setSpecialization(spec);

    if (spec) {
      const specializationCourses = SPECIALIZATION_COURSES[spec];
      setYear2Data(prev => {
        const newData = { ...prev };
        // Update semester 3
        const semester3Courses: Course[] = [
          {
            ...specializationCourses[3][0],
            grade: 'Not finished' as Grade
          }
        ];
        if (electiveSemester3) {
          semester3Courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: 'Not finished' as Grade
          });
        }
        newData.semesters[2] = { courses: semester3Courses };

        // Update semester 4
        const semester4Courses: Course[] = [
          {
            ...specializationCourses[4][0],
            grade: 'Not finished' as Grade
          }
        ];
        if (electiveSemester4) {
          semester4Courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: 'Not finished' as Grade
          });
        }
        newData.semesters[3] = { courses: semester4Courses };

        return newData;
      });
    }
  };

  const handleSecondSpecializationChange = (spec: Specialization) => {
    setElectiveSemester3(null);
    setElectiveSemester4(null);
    setSecondSpecialization(spec);

    if (spec && specialization) {
      const specializationCourses = SPECIALIZATION_COURSES[spec];
      setYear2Data(prev => {
        const newData = { ...prev };
        newData.semesters[2] = {
          courses: [
            ...newData.semesters[2].courses,
            ...specializationCourses[3].map(course => ({
              ...course,
              grade: 'Not finished' as Grade
            }))
          ]
        };
        newData.semesters[3] = {
          courses: [
            ...newData.semesters[3].courses,
            ...specializationCourses[4].map(course => ({
              ...course,
              grade: 'Not finished' as Grade
            }))
          ]
        };
        return newData;
      });
    }
  };

  const handleElectiveTypeChange = (type: ElectiveType, semester: number) => {
    if (secondSpecialization) {
      setSecondSpecialization(null);
      // When an elective is selected and spec2 exists, remove spec2 courses from both semesters
      setYear2Data(prev => {
        const newData = { ...prev };
        if (specialization) {
          const specializationCourses = SPECIALIZATION_COURSES[specialization];
          // Reset both semesters to only contain spec1 courses
          newData.semesters[2] = {
            courses: [specializationCourses[3][0]].map(course => ({
              ...course,
              grade: 'Not finished' as Grade
            }))
          };
          newData.semesters[3] = {
            courses: [specializationCourses[4][0]].map(course => ({
              ...course,
              grade: 'Not finished' as Grade
            }))
          };
        }
        return newData;
      });
    }

    if (semester === 3) {
      setElectiveSemester3(type);
    } else {
      setElectiveSemester4(type);
    }

    if (specialization) {
      setYear2Data(prev => {
        const newData = { ...prev };
        const specializationCourses = SPECIALIZATION_COURSES[specialization];
        
        if (semester === 3) {
          // Update semester 3 while preserving semester 4
          const semester3Courses: Course[] = [
            {
              ...specializationCourses[3][0],
              grade: prev.semesters[2].courses[0].grade
            }
          ];
          
          if (type) {
            semester3Courses.push({
              name: 'Elective Course',
              credits: 7.5,
              grade: 'Not finished' as Grade,
              isPassFail: type === 'Pass/Fail'
            });
          }
          
          newData.semesters[2] = { courses: semester3Courses };
        } else {
          // Update semester 4 while preserving semester 3
          const semester4Courses: Course[] = [
            {
              ...specializationCourses[4][0],
              grade: prev.semesters[3].courses[0].grade
            }
          ];
          
          if (type) {
            semester4Courses.push({
              name: 'Elective Course',
              credits: 7.5,
              grade: 'Not finished' as Grade,
              isPassFail: type === 'Pass/Fail'
            });
          }
          
          newData.semesters[3] = { courses: semester4Courses };
        }
        
        return newData;
      });
    }
  };

  const calculateCumulativeGPA = () => {
    const allCourses: Course[] = [
      ...year1Data.semesters.flatMap(s => s.courses),
      ...year2Data.semesters.flatMap(s => s.courses)
    ];
    return calculateGPA(allCourses);
  };

  const year1Courses = year1Data.semesters.flatMap(s => s.courses);
  const year2Courses = year2Data.semesters.flatMap(s => s.courses);
  const previousYearCourses = [...year1Courses, ...year2Courses];

  return (
  <div className="min-h-screen bg-gray-50">
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SSE GPA Calculator</h1>
          <p className="text-1xl text-black-400 leading-relaxed mb-10 max-w-5xl mx-auto text-justify ">
            Dedicated GPA calculator for students at the Stockholm School of Economics. 
            Designed specifically for the <span className="font-semibold text-indigo-600">
              Bachelor in Business and Economics</span> program. If there's enough demand, 
            we’ll expand to include Retail Management and Master’s program.
          </p>
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
              isThirdYear={true}
              specialization={specialization}
              secondSpecialization={secondSpecialization}
              onSpecializationChange={handleSpecializationChange}
              onSecondSpecializationChange={handleSecondSpecializationChange}
              previousYearCourses={year1Courses}
              electiveSemester3={electiveSemester3}
              electiveSemester4={electiveSemester4}
              onElectiveSemester3Change={(type) => handleElectiveTypeChange(type, 3)}
              onElectiveSemester4Change={(type) => handleElectiveTypeChange(type, 4)}
            />
            <Year3Section previousYearCourses={[...year1Courses, ...year2Courses]} />
          </div>
          
          
        </div>

        
      </div>
      
      <footer className="bg-[#000000] text-white py-12 mt-16">
  <div className="max-w-5xl mx-auto px-4">
    <div className="text-center mb-8">
      <p className="text-lg font-medium mb-4">If you have feedback, want to report a bug, or contribute, please do reach out! :)</p>
      <div className="flex justify-center items-center space-x-8">
        <p>
          <a
            href="https://instagram.com/jonaspeetersen"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            @jonaspeetersen
          </a>
          &nbsp;&nbsp;
          <a
            href="https://www.linkedin.com/in/erik-m-%C3%A5str%C3%B6m-7b02a715b/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            @Erik M. Åström 
          </a>
        </p>
      </div>
    </div>
    <div className="border-t border-gray-700 pt-6 text-justify">
      <span className="text-sm text-gray-500 italic">
      This tool is an independent project developed and maintained by a third party. 
      It is not officially affiliated with, endorsed by, or supported by the Stockholm School of Economics in any capacity. 
      SSE assumes no responsibility for the accuracy, functionality, or use of this tool. 
      The third-party developer also disclaims any liability for errors, inaccuracies, or outcomes resulting from the use of this tool. 
      Users are advised to exercise their own judgment and verify all calculations independently, especially in cases of uncertainty.
      To improve the user experience, we use Hotjar to record anonymous sessions and track interactions such as button clicks. 
      This data helps us understand how users interact with the tool and make improvements. All data collected through Hotjar is anonymized and used solely for enhancing the functionality and usability of the Service
      </span>
    </div>
  </div>
</footer>
    </div>
  );
};

export default Index;
