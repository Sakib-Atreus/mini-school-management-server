import { Module } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { StudentsService } from '../student/student.service';
import { DrizzleModule } from '../../drizzle/drizzle.module';
import { StudentsModule } from '../student/student.module';
import { ClassesController } from './classes.controller';

@Module({
  imports: [DrizzleModule, StudentsModule],
  controllers: [ClassesController],
  providers: [ClassesService, StudentsService],
  exports: [ClassesService],
})
export class ClassesModule {}
