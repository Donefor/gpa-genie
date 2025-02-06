
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
  onSpecializationChange?: (spec: Specialization) => void;
  onSecondSpecializationChange?: (spec: Specialization) => void;
  onElectiveTypeChange?: (type: ElectiveType) => void;
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
  onSpecializationChange,
  onSecondSpecializationChange,
  onElectiveTypeChange,
  previousYearCourses = [] 
}: YearSectionProps) => {
  const [gpa, setGpa] = useState(0);

  useEffect(() => {
    const allCourses = [...previousYearCourses, ...semesters.flatMap(semester => semester.courses)];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses, JSON.stringify(semesters)]);

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
          // Show selection menu after semester 2
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
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="min-w-[120px]">Specialization:</span>
                        <SpecializationSelect
                          value={specialization || null}
                          onChange={onSpecializationChange!}
                          disabledOptions={secondSpecialization ? [secondSpecialization] : []}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="min-w-[120px]">Second Specialization:</span>
                        <SpecializationSelect
                          value={secondSpecialization || null}
                          onChange={onSecondSpecializationChange!}
                          disabledOptions={[
                            ...(specialization ? [specialization] : []),
                            ...(electiveType ? ['ALL' as Specialization] : [])
                          ]}
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <span className="min-w-[120px]">Semester 3 Elective:</span>
                        <ElectiveSelect
                          value={electiveType || null}
                          onChange={onElectiveTypeChange!}
                          disabled={!!secondSpecialization}
                        />
                      </div>
                      
                      <div className="flex items-center space-x-4">
                        <span className="min-w-[120px]">Semester 4 Elective:</span>
                        <ElectiveSelect
                          value={electiveType || null}
                          onChange={onElectiveTypeChange!}
                          disabled={!!secondSpecialization || !!electiveType}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )}
            </div>
          );
        })}
        <div className="mt-6 w-full bg-secondary p-4">
          <Badge variant="secondary" className="text-lg px-4 py-1">
            {getYearLabel(yearNumber)}: {gpa.toFixed(2)}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};
