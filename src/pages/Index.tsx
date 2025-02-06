
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
    // Clear second specialization and electives when changing primary specialization
    setSecondSpecialization(null);
    setElectiveSemester3(null);
    setElectiveSemester4(null);
    setSpecialization(spec);

    if (spec) {
      const specializationCourses = SPECIALIZATION_COURSES[spec];
      setYear2Data(prev => {
        const newData = { ...prev };
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
        return newData;
      });
    }
  };

  const handleSecondSpecializationChange = (spec: Specialization) => {
    // Clear electives when setting second specialization
    setElectiveSemester3(null);
    setElectiveSemester4(null);
    setSecondSpecialization(spec);

    if (spec && specialization) {
      const specializationCourses = SPECIALIZATION_COURSES[spec];
      setYear2Data(prev => {
        const newData = { ...prev };
        // Combine courses from both specializations
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
    // Clear second specialization if it exists
    if (secondSpecialization) {
      setSecondSpecialization(null);
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
        } else {
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
