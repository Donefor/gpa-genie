import { useState, useEffect } from 'react';
import { Course, Grade, Specialization, ElectiveType } from '@/types';
import { SemesterTable } from './SemesterTable';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { calculateGPA } from '@/utils/calculations';
import { Badge } from '@/components/ui/badge';
import { SpecializationSelect } from './SpecializationSelect';
import { ElectiveSelect } from './ElectiveSelect';

interface YearSectionProps {
  yearNumber: number;
  semesters: { courses: Course[] }[];
  onGradeChange: (semesterIndex: number, courseIndex: number, grade: Grade) => void;
  isThirdYear?: boolean;
  specialization?: Specialization;
  secondSpecialization?: Specialization;
  electiveType?: ElectiveType;
  electiveSemester3?: ElectiveType;
  electiveSemester4?: ElectiveType;
  onSpecializationChange?: (spec: Specialization) => void;
  onSecondSpecializationChange?: (spec: Specialization) => void;
  onElectiveTypeChange?: (type: ElectiveType) => void;
  onElectiveSemester3Change?: (type: ElectiveType) => void;
  onElectiveSemester4Change?: (type: ElectiveType) => void;
  previousYearCourses?: Course[];
}

export const YearSection = ({ 
  yearNumber, 
  semesters, 
  onGradeChange, 
  isThirdYear,
  specialization,
  secondSpecialization,
  electiveType,
  electiveSemester3,
  electiveSemester4,
  onSpecializationChange,
  onSecondSpecializationChange,
  onElectiveTypeChange,
  onElectiveSemester3Change,
  onElectiveSemester4Change,
  previousYearCourses = [] 
}: YearSectionProps) => {
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    const allCourses = [...previousYearCourses, ...semesters.flatMap(semester => semester.courses)];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses]);

  const handleSpecializationChange = (spec: Specialization) => {
    // Clear second specialization when changing primary
    if (onSecondSpecializationChange) onSecondSpecializationChange(null);
    
    // Then set the new primary specialization
    if (onSpecializationChange) onSpecializationChange(spec);
  };

  const handleSecondSpecializationChange = (spec: Specialization) => {
    if (!specialization) return; // Prevent selecting second spec without primary
    
    // Clear all electives first
    if (onElectiveSemester3Change) onElectiveSemester3Change(null);
    if (onElectiveSemester4Change) onElectiveSemester4Change(null);
    
    // Set the second specialization
    if (onSecondSpecializationChange) {
      onSecondSpecializationChange(spec);
    }
  };

  const handleElectiveChange = (type: ElectiveType, semesterHandler: ((type: ElectiveType) => void) | undefined) => {
    // Always remove second specialization courses first if they exist
    if (secondSpecialization && onSecondSpecializationChange) {
      onSecondSpecializationChange(null);
    }
    
    // Then set the new elective
    if (semesterHandler) {
      semesterHandler(type);
    }
  };

  const getYearLabel = (year: number) => {
    switch (year) {
      case 1:
        return "First year GPA";
      case 2:
        return "Second year GPA";
      case 3:
        return "Third year GPA";
      default:
        return `Year ${year} GPA`;
    }
  };

  const showSpecializationMenu = isThirdYear && yearNumber === 2;

  return (
    <Card className="mb-8 overflow-hidden">
      <CardHeader className={`${yearNumber === 2 ? 'bg-secondary w-full' : 'bg-secondary'}`}>
        <CardTitle className="text-2xl font-semibold">
          {yearNumber === 1 ? "First year" : yearNumber === 2 ? "Second year" : `Year ${yearNumber}`}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {semesters.map((semester, semesterIndex) => {
          const showSelectionMenu = semesterIndex === 1 && showSpecializationMenu;
          
          return (
            <div key={semesterIndex}>
              <div className="mb-8">
                <h3 className="text-lg font-medium mb-4">Semester {semesterIndex + 1}</h3>
                <SemesterTable
                  courses={semester.courses}
                  onGradeChange={(courseIndex, grade) => 
                    onGradeChange(semesterIndex, courseIndex, grade)
                  }
                  isThirdYear={isThirdYear}
                  semester={semesterIndex + 1}
                  specialization={specialization}
                  secondSpecialization={secondSpecialization}
                  electiveType={electiveType}
                  onSpecializationChange={onSpecializationChange}
                  onSecondSpecializationChange={onSecondSpecializationChange}
                  onElectiveTypeChange={onElectiveTypeChange}
                />
              </div>

              {showSelectionMenu && (
                <Card className="mb-8 bg-muted p-6">
                  <div className="space-y-6">
                    <div className="flex items-start space-x-8">
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Primary Specialization</span>
                        <SpecializationSelect
                          value={specialization || null}
                          onChange={handleSpecializationChange}
                          disabledOptions={secondSpecialization ? [secondSpecialization] : []}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Second Specialization</span>
                        <SpecializationSelect
                          value={secondSpecialization || null}
                          onChange={handleSecondSpecializationChange}
                          disabled={!specialization}
                          disabledOptions={specialization ? [specialization] : []}
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-8">
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Semester 3 Elective</span>
                        <ElectiveSelect
                          value={electiveSemester3}
                          onChange={(type) => handleElectiveChange(type, onElectiveSemester3Change)}
                          disabled={!specialization}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Semester 4 Elective</span>
                        <ElectiveSelect
                          value={electiveSemester4}
                          onChange={(type) => handleElectiveChange(type, onElectiveSemester4Change)}
                          disabled={!specialization}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
        <div className="mt-6 w-full bg-muted p-4 rounded-lg">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {getYearLabel(yearNumber)}: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
