
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
  const [electiveSemesters, setElectiveSemesters] = useState<number[]>([]);

  useEffect(() => {
    const allCourses = [...previousYearCourses, ...semesters.flatMap(semester => semester.courses)];
    const calculatedGPA = calculateGPA(allCourses);
    setGpa(calculatedGPA);
  }, [semesters, previousYearCourses, JSON.stringify(semesters)]);

  const handleElectiveTypeChange = (semester: number, type: ElectiveType) => {
    if (type) {
      // If selecting an elective for a specific semester
      if (secondSpecialization) {
        // If there's a second specialization, remove it only for this semester
        const updatedElectives = [...electiveSemesters];
        if (!updatedElectives.includes(semester)) {
          updatedElectives.push(semester);
        }
        setElectiveSemesters(updatedElectives);
        
        // If this was the last non-elective semester, remove second specialization
        if (updatedElectives.length === 2) {
          onSecondSpecializationChange(null);
        }
      }
      onElectiveTypeChange(type);
    } else {
      // If removing an elective
      setElectiveSemesters(electiveSemesters.filter(sem => sem !== semester));
    }
  };

  const handleSecondSpecializationChange = (spec: Specialization) => {
    if (spec) {
      // If selecting a second specialization, remove any existing electives
      setElectiveSemesters([]);
      onElectiveTypeChange(null);
    }
    onSecondSpecializationChange(spec);
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
                          onChange={onSpecializationChange!}
                          disabledOptions={secondSpecialization ? [secondSpecialization] : []}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Second Specialization</span>
                        <SpecializationSelect
                          value={secondSpecialization || null}
                          onChange={handleSecondSpecializationChange}
                          disabledOptions={specialization ? [specialization] : []}
                        />
                      </div>
                    </div>

                    <div className="flex items-start space-x-8">
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Semester 3 Elective</span>
                        <ElectiveSelect
                          value={electiveSemesters.includes(3) ? electiveType : null}
                          onChange={(type) => handleElectiveTypeChange(3, type)}
                          disabled={false}
                        />
                      </div>
                      <div className="flex-1">
                        <span className="block text-sm font-medium mb-2">Semester 4 Elective</span>
                        <ElectiveSelect
                          value={electiveSemesters.includes(4) ? electiveType : null}
                          onChange={(type) => handleElectiveTypeChange(4, type)}
                          disabled={false}
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
