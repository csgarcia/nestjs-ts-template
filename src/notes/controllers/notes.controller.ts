import { Controller, Get } from '@nestjs/common';
import { NotesService } from '../services/notes.service';

@Controller({ path: 'notes', version: '1' })
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Get('/')
  getHello(): string {
    return this.notesService.getHello();
  }
}
