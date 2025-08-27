import { Module } from '@nestjs/common';
import { StudentsService } from './student.service';
import { DrizzleModule } from '../../drizzle/drizzle.module';

@Module({
    imports: [DrizzleModule],
  providers: [StudentsService],
  exports: [StudentsService],
})
export class StudentsModule {}
