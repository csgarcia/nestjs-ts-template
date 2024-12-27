import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { DocApiResponse } from '../../common/decorators/response-docs.decorator';
import { NotesResponseDto } from '../dto/notes.response.dto';
import { ApiExtraModels } from '@nestjs/swagger';

@Controller({ path: 'notes', version: '1' })
@ApiExtraModels(NotesResponseDto)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('/')
  @DocApiResponse(HttpStatus.CREATED, 'Ok', 0, NotesResponseDto)
  @DocApiResponse(HttpStatus.BAD_REQUEST, 'Error in Create DTO', 1000)
  async create() {
    return this.notesService.create();
  }

  @Get('/')
  @DocApiResponse(HttpStatus.OK, 'Ok', 0, NotesResponseDto, 'array')
  async getAll() {
    return this.notesService.getAll();
  }
}
