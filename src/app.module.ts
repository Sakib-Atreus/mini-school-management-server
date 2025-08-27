import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { ClassesModule } from './modules/classes/classes.module';
import { StudentsModule } from './modules/student/student.module';
import { DrizzleModule } from './drizzle/drizzle.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // loads .env
    DrizzleModule,
    AuthModule,
    UsersModule,
    StudentsModule,
    ClassesModule
  ],
  controllers: [AppController],
  providers: [AppService, ],
})
export class AppModule {}
