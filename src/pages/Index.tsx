
import { useState } from 'react';
import { YearSection } from '@/components/YearSection';
import { YEAR_1_COURSES, YEAR_2_COURSES, SPECIALIZATION_COURSES } from '@/data/courseData';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { calculateGPA } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';

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
        const semester3Courses = [specializationCourses[3][0]];
        if (electiveSemester3) {
          semester3Courses.push({
            name: 'Elective Course',
            credits: 7.5,
            grade: 'Not finished' as Grade
          });
        }
        newData.semesters[2] = { courses: semester3Courses };

        // Update semester 4
        const semester4Courses = [specializationCourses[4][0]];
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
      const specializationCourses = SPECIALIZATION_COURSES[specialization];
      setYear2Data(prev => {
        const newData = { ...prev };
        
        if (semester === 3) {
          // Only update semester 3, keep semester 4 unchanged
          newData.semesters[2] = {
            courses: [
              specializationCourses[3][0],
              type ? {
                name: 'Elective Course',
                credits: 7.5,
                grade: 'Not finished' as Grade
              } : null
            ].filter(Boolean) as Course[]
          };
          // Keep semester 4 as is
          newData.semesters[3] = prev.semesters[3];
        } else {
          // Only update semester 4, keep semester 3 unchanged
          newData.semesters[3] = {
            courses: [
              specializationCourses[4][0],
              type ? {
                name: 'Elective Course',
                credits: 7.5,
                grade: 'Not finished' as Grade
              } : null
            ].filter(Boolean) as Course[]
          };
          // Keep semester 3 as is
          newData.semesters[2] = prev.semesters[2];
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SSE GPA Calculator</h1>
          <p className="text-lg text-gray-600 mb-6">
            Calculate your GPA based on course performance
          </p>
          <Badge variant="secondary" className="text-xl px-6 py-2">
            Cumulative GPA: {calculateCumulativeGPA().toFixed(2)}
          </Badge>
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
        </div>
      </div>
    </div>
  );
};

export default Index;

