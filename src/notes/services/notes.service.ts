import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../entities/note.entity';
import { Repository } from 'typeorm';
import { constants } from '../constants/notes.constants';
import { CustomException } from '../../common/exceptions/custom.exception';
import { CreateNoteDto, UpdateNoteDto } from '../dto/notes.dto';

const { RESPONSES } = constants;

@Injectable()
export class NotesService {
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
  ) {}

  async create(createNoteDto: CreateNoteDto): Promise<Note> {
    const user = new Note();
    user.title = createNoteDto.title;
    user.description = createNoteDto.description;
    return this.noteRepository.save(user);
  }

  async update(noteId: string, updateNoteDto: UpdateNoteDto): Promise<Note> {
    const note = await this.getOne(noteId);
    this.noteRepository.merge(note, updateNoteDto);
    return this.noteRepository.save(note);
  }

  async delete(noteId: string): Promise<void> {
    await this.noteRepository.delete(noteId);
  }

  async getOne(noteId: string): Promise<Note> {
    const note = await this.noteRepository.findOneBy({
      id: noteId,
    });
    if (!note) {
      throw new CustomException(
        RESPONSES.NOT_FOUND.code,
        RESPONSES.NOT_FOUND.message,
        RESPONSES.NOT_FOUND.http_code,
      );
    }
    return note;
  }

  async getAll(): Promise<Note[]> {
    return this.noteRepository.find();
  }
}
