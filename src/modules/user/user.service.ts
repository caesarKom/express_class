import db from '../../db/db';
import { Service } from 'typedi';
import { CreateUserDto } from './dto/createUser.dto';
import { genAPIKey } from '../../utils/gen.api.key';
import { Roles } from '../auth/types/role.enum';
import { ChangePasswordDto } from './dto/change-pwd.dto';
import { BadRequestError } from 'routing-controllers';
import { HashService } from '../../infrastructure/services/hash/hash.service';
import { UpdateUserProfileDto } from './dto/update-profile';

@Service()
export class UserService {
  constructor(private readonly hashService: HashService) {}

  setRole(id: string, role: Roles) {
    return db.user.update({
      where: { id },
      data: {
        role
      }
    });
  }

  async create(createUserDto: CreateUserDto) {
    return await db.user.create({
      data: {
        email: createUserDto.email,
        username: createUserDto.username,
        password: createUserDto.password,
        image: createUserDto.image,
        apiKey: genAPIKey()
      }
    });
  }

  async getAllUsers() {
    const users = await db.user.findMany({});
    if (users.length === 0) return { message: 'Not Users on Database' };
    return users;
  }

  getUserProfile(userId: string) {
    return db.profile.findUnique({
      where: { userId }
    });
  }

  findMany() {
    return db.user.findMany();
  }

  findByEmail(email: string) {
    return db.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return db.user.findUnique({ where: { id } });
  }

  update(id: string, updateUserDto: string) {}

  async remove(id: string) {
    await db.user.delete({ where: { id } });
    return { message: 'User account deleted successfully' };
  }

  async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
    const user = await db.user.findUnique({ where: { id: userId } });

    if (!user) throw new BadRequestError();

    const matchPassword = this.hashService.compare(
      changePasswordDto.currentPassword,
      user.password
    );

    if (!matchPassword) throw new BadRequestError('old password not valid');

    const hashNewPassword = await this.hashService.make(
      changePasswordDto.newPassword
    );

    return db.user.update({
      where: { id: userId },
      data: {
        password: hashNewPassword
      }
    });
  }

  async updateProfile(userId: string, updateUserProfile: UpdateUserProfileDto) {
    return await db.profile.upsert({
      where: { userId },
      create: {
        firstName: updateUserProfile.firstName,
        lastName: updateUserProfile.lastName,
        address: updateUserProfile.address,
        phone: updateUserProfile.phone,
        user: {
          connect: { id: userId }
        }
      },
      update: {
        firstName: updateUserProfile.firstName,
        lastName: updateUserProfile.lastName,
        address: updateUserProfile.address,
        phone: updateUserProfile.phone
      }
    });
  }
}
