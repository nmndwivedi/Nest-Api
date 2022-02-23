import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUser() {
    return {
      name: 'Naman',
      age: 23,
    };
  }
}
