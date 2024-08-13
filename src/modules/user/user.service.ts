import db from "../../db/db";
import { Service } from "typedi";
import { CreateUserDto } from "./dto/createUser.dto";
import { genAPIKey } from "../../utils/gen.api.key";

@Service()
export class UserService {
    constructor() {}
    
    async create(createUserDto: CreateUserDto) {
        return await db.user.create({
            data: {
                email: createUserDto.email,
                username: createUserDto.username,
                password: createUserDto.password,
                apiKey: genAPIKey()
            }
        })
    }
    
   async getAllUsers() {
        const users = await db.user.findMany({});
        if (users.length === 0) return { message: "Not Users on Database"}
        return users
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
}