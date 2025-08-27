// dto/enroll-student.dto.ts
import { IsInt } from "class-validator";

export class EnrollStudentDto {
  @IsInt()
  userId: number;
}
