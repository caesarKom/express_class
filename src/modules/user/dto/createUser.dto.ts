export class CreateUserDto {
    email!: string;
    username!: string;
    password!: string;
    image: string | null | undefined;
  }