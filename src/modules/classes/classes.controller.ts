/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Get,
} from '@nestjs/common';
import { CreateClassDto } from './dto/create-class.dto';
import { EnrollStudentDto } from '../student/dto/enroll-student.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../../common/guard/roles.guard';
import { Roles } from '../../common/decorator/roles.decorator';
import { ClassesService } from './classes.service';
import { StudentsService } from '../student/student.service';

@Controller("classes")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClassesController {
  constructor(
    private classService: ClassesService,
    private studentService: StudentsService,
  ) {}

  @Post("create-class")
  @Roles("admin")
  async createClass(@Body() dto: CreateClassDto) {
    return this.classService.createClass(dto.name, dto.section);
  }

  @Post(':id/enroll')
  @Roles('admin', 'teacher')
  async enrollStudent(
    @Param('id', ParseIntPipe) classId: number,
    @Body() dto: EnrollStudentDto,
  ) {
    return this.studentService.enrollUserInClass(dto.userId, classId);
  }

  @Get(':id/students')
  @Roles('admin', 'teacher')
  async getStudents(@Param('id', ParseIntPipe) classId: number) {
    return this.studentService.getStudentsByClass(classId);
  }
}
