
import { Course } from '@/types';
import { GradeSelect } from './GradeSelect';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface SemesterTableProps {
  courses: Course[];
  onGradeChange: (courseIndex: number, grade: Course['grade']) => void;
  isThirdYear?: boolean;
}

export const SemesterTable = ({ courses, onGradeChange, isThirdYear }: SemesterTableProps) => {
  return (
    <Table className="fade-in">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[300px]">Course</TableHead>
          <TableHead>ECTS</TableHead>
          <TableHead className="pl-[70px]">Grade</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {courses.map((course, index) => (
          <TableRow key={course.name}>
            <TableCell className="font-medium">{course.name}</TableCell>
            <TableCell>{course.credits}</TableCell>
            <TableCell>
              <GradeSelect
                value={course.grade}
                onChange={(grade) => onGradeChange(index, grade)}
                isThirdYear={isThirdYear}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
