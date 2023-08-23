import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from '../contants';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { config } from 'dotenv';
config();

export class AuthGuard implements CanActivate {
  constructor(private reflector: Reflector, private jwtService: JwtService) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    try {
      const isPublic = this.reflector.getAllAndOverride<boolean>(
        IS_PUBLIC_KEY,
        [context.getClass(), context.getHandler()],
      );

      if (isPublic) return true;

      const request = context.switchToHttp().getRequest();
      const token = this.extractToken(request);

      const decodedUser = this.jwtService.verify(token, {
        secret: process.env.JWT_SECRET,
      });

      request['user'] = decodedUser;
      return true;
    } catch (err) {
      return false;
    }
  }

  private extractToken(req: Request): string | undefined {
    const [type, token] = req.headers.authorization?.split(' ');
    return type == 'Bearer' ? token : undefined;
  }
}
