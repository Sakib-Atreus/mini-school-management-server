import { Controller, Get, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../../common/guard/roles.guard";
import { Roles } from "../../common/decorator/roles.decorator";
import { UsersService } from "./user.service";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles("admin")
  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

}
