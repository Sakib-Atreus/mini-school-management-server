// dto/enroll-student.dto.ts
import { IsInt, IsUUID, Max, Min } from "class-validator";

export class EnrollStudentDto {
  @IsUUID()
  userId: string;

  @IsInt()
  @Min(5, { message: 'Age must be at least 5 years old' })
  @Max(25, { message: 'Age must be at most 25 years old' })
  age: number;
}
