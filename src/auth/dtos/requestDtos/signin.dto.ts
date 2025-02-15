import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from './signup.dto';

export class SignInDto extends PickType(CreateUserDto, [
  'email',
  'password',
] as const) {}
