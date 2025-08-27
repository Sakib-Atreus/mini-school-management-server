import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "../decorator/roles.decorator";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, ctx.getHandler());
    const req = ctx.switchToHttp().getRequest<{ user?: { role?: string } }>();
    const user = req.user;
    if (!user) throw new ForbiddenException("Access denied");
    if (!requiredRoles || requiredRoles.length === 0) return true;
    if (!requiredRoles.includes(user.role ?? "")) throw new ForbiddenException("Access denied");
    return true;
  }
}
