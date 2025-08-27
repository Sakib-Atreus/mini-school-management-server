import { Module } from "@nestjs/common";
import { UsersController } from "./user.controller";
import { UsersService } from "./user.service";
import { DrizzleModule } from '../../drizzle/drizzle.module';


@Module({
  imports: [DrizzleModule],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService],
})
export class UsersModule {}
