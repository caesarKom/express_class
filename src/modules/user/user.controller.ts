import { Get, JsonController, Req, UseBefore } from "routing-controllers";
import { Service } from "typedi";
import { UserService } from "./user.service";
import { Request } from "express";
import { AuthCheck, isAuthKey } from "../../infrastructure/middlewares/auth.middleware";

@Service()
@JsonController('/user')
//@UseBefore(AuthCheck)
export class UserController {
    constructor(private readonly userService: UserService) {}
    
    @Get()
    //@UseBefore(HasRole(Roles.Admin))
    getAllUsers() {
        return this.userService.getAllUsers();
    }
    
    @Get('/test')
    @UseBefore(isAuthKey)
    test(@Req() req: Request) {
        return { msg: "TEST"}
    }
}