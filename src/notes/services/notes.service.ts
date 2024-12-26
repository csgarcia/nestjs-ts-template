import { Injectable } from '@nestjs/common';

@Injectable()
export class NotesService {
  constructor() {}

  getHello(): string {
    return 'Hello World!';
  }
}
