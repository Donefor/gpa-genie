
import { Course, Specialization, ElectiveType } from '@/types';
import { GradeSelect } from './GradeSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SpecializationSelect } from './SpecializationSelect';
import { ElectiveSelect } from './ElectiveSelect';

interface SemesterTableProps {
  courses: Course[];
  onGradeChange: (courseIndex: number, grade: Course['grade']) => void;
  isThirdYear?: boolean;
  semester?: number;
  specialization?: Specialization;
  secondSpecialization?: Specialization;
  electiveType?: ElectiveType;
  onSpecializationChange?: (spec: Specialization) => void;
  onSecondSpecializationChange?: (spec: Specialization) => void;
  onElectiveTypeChange?: (type: ElectiveType) => void;
}

export const SemesterTable = ({ 
  courses, 
  onGradeChange, 
  isThirdYear,
  semester,
  specialization,
  secondSpecialization,
  electiveType,
  onSpecializationChange,
  onSecondSpecializationChange,
  onElectiveTypeChange
}: SemesterTableProps) => {
  const showSpecializationSelect = isThirdYear && (semester === 3 || semester === 4);
  const totalCredits = courses.reduce((sum, course) => sum + course.credits, 0);

  return (
    <div className="space-y-4">
      {showSpecializationSelect && (
        <div className="space-y-4 mb-4">
          <div className="flex items-center space-x-4">
            <span className="min-w-[120px]">Specialization:</span>
            <SpecializationSelect
              value={specialization || null}
              onChange={onSpecializationChange!}
              disabledOptions={secondSpecialization ? [secondSpecialization] : []}
            />
          </div>
          
          {totalCredits < 15 && (
            <>
              <div className="flex items-center space-x-4">
                <span className="min-w-[120px]">Second Specialization:</span>
                <SpecializationSelect
                  value={secondSpecialization || null}
                  onChange={onSecondSpecializationChange!}
                  disabledOptions={specialization ? [specialization] : []}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="min-w-[120px]">Elective:</span>
                <ElectiveSelect
                  value={electiveType || null}
                  onChange={onElectiveTypeChange!}
                  disabled={totalCredits >= 15}
                />
              </div>
            </>
          )}
        </div>
      )}

      <Table className="fade-in">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Course</TableHead>
            <TableHead>ECTS</TableHead>
            <TableHead className="pl-[405px]">Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.map((course, index) => (
            <TableRow key={course.name}>
              <TableCell className="font-medium">{course.name}</TableCell>
              <TableCell>{course.credits}</TableCell>
              <TableCell>
                {course.isPassFail ? (
                  <span className="text-gray-500">(Pass/Fail)</span>
                ) : (
                  <GradeSelect
                    value={course.grade}
                    onChange={(grade) => onGradeChange(index, grade)}
                    isThirdYear={isThirdYear}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
