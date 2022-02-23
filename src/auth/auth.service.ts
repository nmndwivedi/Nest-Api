import { Injectable } from '@nestjs/common';
import { AuthDTO } from './dto';

@Injectable()
export class AuthService {
  login(body: AuthDTO) {
    return { body };
  }
}
