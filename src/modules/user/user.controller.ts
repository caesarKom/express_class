import {
  Body,
  Delete,
  Get,
  HttpCode,
  JsonController,
  Param,
  Post,
  Put,
  UseBefore
} from 'routing-controllers';
import { Service } from 'typedi';
import { UserService } from './user.service';
import { AuthCheck } from '../../infrastructure/middlewares/auth.middleware';
import { HasRole } from '../../infrastructure/middlewares/hasRole.middleware';
import { Roles } from '../auth/types/role.enum';
import { GetCurrentUserId } from '../../decorators/get-current-user-id.decorator';
import { CreateUserDto } from './dto/createUser.dto';
import { ChangePasswordDto } from './dto/change-pwd.dto';
import { UpdateUserProfileDto } from './dto/update-profile';

@Service()
@JsonController('/user')
@UseBefore(AuthCheck)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseBefore(HasRole(Roles.Admin))
  getAllUsers() {
    return this.userService.getAllUsers();
  }

  @Get('/profile')
  @HttpCode(200)
  getUserProfile(@GetCurrentUserId() userId: string) {
    return this.userService.getUserProfile(userId);
  }

  @Post()
  @HttpCode(201)
  @UseBefore(HasRole(Roles.Admin))
  createUser(@Body() payload: CreateUserDto) {
    return this.userService.create(payload);
  }

  @Post('/set-user-role/:id')
  @UseBefore(HasRole(Roles.Admin))
  setRole(@Param('id') id: string, @Body() payload: { role: Roles }) {
    return this.userService.setRole(id, payload.role);
  }

  @Post('/change-password')
  @HttpCode(200)
  changePassword(
    @GetCurrentUserId() userId: string,
    @Body() changePassword: ChangePasswordDto
  ) {
    return this.userService.changePassword(userId, changePassword);
  }

  @Put('/profile')
  updateUserProfile(
    @GetCurrentUserId() userId: string,
    @Body() updateUserProfileDto: UpdateUserProfileDto
  ) {
    return this.userService.updateProfile(userId, updateUserProfileDto);
  }

  @Delete('/:id')
  @HttpCode(200)
  @UseBefore(HasRole(Roles.Admin))
  deleteUser(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  @Delete('/delete-account')
  @HttpCode(200)
  deleteAccount(@GetCurrentUserId() userId: string) {
    return this.userService.remove(userId);
  }
}
