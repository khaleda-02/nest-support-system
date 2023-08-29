import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './common/guards/auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { RolesGuard } from './common/guards/roles.guard';
import { UserService } from './modules/user/user.service';
import { AdminService } from './modules/admin/services/admin.service';
import { AssignedStaffGuard } from './common/guards/staff-ticket.guard';

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
  const adminService = app.get(AdminService);
  app.useGlobalGuards(
    new AuthGuard(refelector, jwtService, userService),
    new RolesGuard(refelector),
    new AssignedStaffGuard(refelector, adminService),
  );

  // standardrize
  app.useGlobalInterceptors(new TransformInterceptor());

  await app.listen(3000);
}
bootstrap();
