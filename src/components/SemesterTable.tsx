
import { Course, Specialization, ElectiveType } from '@/types';
import { GradeSelect } from './GradeSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { SpecializationSelect } from './SpecializationSelect';
import { ElectiveSelect } from './ElectiveSelect';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  const totalCredits = courses?.reduce((sum, course) => {
    if (!course) return sum;
    return sum + course.credits;
  }, 0) || 0;

  // Filter out any undefined or null courses
  const validCourses = courses?.filter((course): course is Course => course != null) || [];

  return (
    <div className="space-y-4 w-full overflow-x-hidden">
      <Table className="fade-in w-full">
        <TableHeader>
          <TableRow>
            <TableHead className={isMobile ? "w-[40%]" : "w-[300px]"}>Course</TableHead>
            <TableHead className={isMobile ? "w-[20%] text-center" : "w-[300px]"}>ECTS</TableHead>
            <TableHead className={isMobile ? "w-[40%]" : "w-[300px] pl-[160px]"}>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validCourses.map((course, index) => (
            <TableRow key={course.name}>
              <TableCell className={`font-medium ${isMobile ? "text-sm break-words" : ""}`}>{course.name}</TableCell>
              <TableCell className={isMobile ? "text-center text-sm" : ""}>{course.credits}</TableCell>
              <TableCell>
                {course.isPassFail ? (
                  <div className="flex justify-end">
                    <div className={`${isMobile ? "w-full text-sm" : "w-[140px]"} h-10 bg-muted flex items-center justify-center rounded-md border border-input`}>
                      Pass/Fail
                    </div>
                  </div>
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
