import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';

@Controller('admins/staffs')
export class AdminStaffController {
  constructor() {}

  @Post()
  create(@Body() createAdminDto) {}

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
