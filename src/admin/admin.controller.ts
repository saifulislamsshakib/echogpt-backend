import {
  Controller,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';

import { AdminService } from './admin.service';

import { JwtGuard } from '../auth/guards/jwt.guard';

import { RolesGuard } from '../common/guards/roles.guard';

import { Roles } from '../common/decorators/roles.decorator';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('users')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }
  @Patch('users/:id/role')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  updateRole(@Param('id') id: string, @Body() dto: UpdateRoleDto) {
    return this.adminService.updateUserRole(Number(id), dto.roleId);
  }
  @Delete('users/:id')
  @UseGuards(JwtGuard, RolesGuard)
  @Roles('ADMIN')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(Number(id));
  }
}
