
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

  const validCourses = courses?.filter((course): course is Course => course != null) || [];

  return (
    <div className={`w-full ${isMobile ? '-mx-4 px-0' : ''}`}>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className={isMobile ? "w-[50%] px-2" : "w-[300px]"}>Course</TableHead>
            <TableHead className={isMobile ? "w-[20%] text-center px-2" : "w-[300px]"}>ECTS</TableHead>
            <TableHead className={isMobile ? "w-[30%] text-right px-2" : "w-[300px] pl-[160px]"}>Grade</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {validCourses.map((course, index) => (
            <TableRow key={course.name} className={isMobile ? "px-0" : ""}>
              <TableCell className={`font-medium ${isMobile ? "px-2" : ""}`}>
                <div className={isMobile ? "text-sm break-words" : ""}>
                  {course.name}
                </div>
              </TableCell>
              <TableCell className={`${isMobile ? "text-center text-sm px-2" : ""}`}>
                {course.credits}
              </TableCell>
              <TableCell className={isMobile ? "px-2" : ""}>
                <div className={isMobile ? "flex justify-end w-full" : ""}>
                  {course.isPassFail ? (
                    <div className={`${isMobile ? "w-full text-sm" : "w-[140px]"} h-10 bg-muted flex items-center justify-center rounded-md border border-input`}>
                      Pass/Fail
                    </div>
                  ) : (
                    <GradeSelect
                      value={course.grade}
                      onChange={(grade) => onGradeChange(index, grade)}
                      isThirdYear={isThirdYear}
                    />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
