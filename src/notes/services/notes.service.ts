import { Injectable } from '@nestjs/common';

@Injectable()
export class NotesService {
  constructor() {}

  async create(): Promise<any> {}

  async getAll(): Promise<any[]> {
    return [];
  }
}
