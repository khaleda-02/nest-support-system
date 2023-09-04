import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RolesGuard } from './common/guards/roles.guard';
import { UserService } from './modules/user/user.service';
import { AssignedStaffGuard } from './common/guards/staff-ticket.guard';
import { StaffService } from './modules/admin/services/staff.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // pipes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  const refelector = app.get(Reflector);
  const jwtService = app.get(JwtService);
  const userService = app.get(UserService);
  const staffService = app.get(StaffService);
  app.useGlobalGuards(
    new AuthGuard(refelector, jwtService, userService),
    new RolesGuard(refelector),
    new AssignedStaffGuard(refelector, staffService),
  );

  // standardrize
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
