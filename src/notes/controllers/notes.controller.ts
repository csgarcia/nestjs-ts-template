import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  Version,
} from '@nestjs/common';
import { NotesService } from '../services/notes.service';
import { DocApiResponse } from '../../common/decorators/response-docs.decorator';
import { NotesResponseDto } from '../dto/notes.response.dto';
import { ApiExtraModels } from '@nestjs/swagger';
import { CreateNoteDto, UpdateNoteDto } from '../dto/notes.dto';
import { Note } from '../entities/note.entity';

@Controller({ path: 'notes' })
@ApiExtraModels(NotesResponseDto, Note)
export class NotesController {
  constructor(private readonly notesService: NotesService) {}

  @Post('/')
  @Version('1')
  @DocApiResponse(HttpStatus.CREATED, 'Ok', 0, Note)
  @DocApiResponse(HttpStatus.BAD_REQUEST, 'Error in Create DTO', 0)
  @DocApiResponse(HttpStatus.INTERNAL_SERVER_ERROR, 'Error in Database', 0)
  async create(@Body() createNoteDto: CreateNoteDto): Promise<Note> {
    return this.notesService.create(createNoteDto);
  }

  @Get('/')
  @Version('2')
  @DocApiResponse(HttpStatus.OK, 'Ok', 0, Note, 'array')
  async getAllV2(): Promise<Note[]> {
    return this.notesService.getAllV2();
  }

  @Get('/')
  @Version('1')
  @DocApiResponse(HttpStatus.OK, 'Ok', 0, Note, 'array')
  async getAll(): Promise<Note[]> {
    return this.notesService.getAll();
  }

  @Get('/:note_id')
  @Version('1')
  @DocApiResponse(HttpStatus.OK, 'Ok', 0, Note)
  @DocApiResponse(HttpStatus.NOT_FOUND, 'Note not found', 1000)
  async getOne(@Param('note_id', ParseUUIDPipe) noteId: string): Promise<Note> {
    return this.notesService.getOne(noteId);
  }

  @Put('/:note_id')
  @Version('1')
  @DocApiResponse(HttpStatus.OK, 'Updated', 0, Note)
  @DocApiResponse(HttpStatus.NOT_FOUND, 'Note not found for update', 1000)
  @DocApiResponse(HttpStatus.BAD_REQUEST, 'Error in Update DTO', 0)
  async update(
    @Param('note_id', ParseUUIDPipe) noteId: string,
    @Body() updateNoteDto: UpdateNoteDto,
  ): Promise<Note> {
    return this.notesService.update(noteId, updateNoteDto);
  }

  @Delete('/:note_id')
  @Version('1')
  @DocApiResponse(HttpStatus.OK, 'Deleted', 0)
  async deletel(
    @Param('note_id', ParseUUIDPipe) noteId: string,
  ): Promise<void> {
    return this.notesService.delete(noteId);
  }
}
