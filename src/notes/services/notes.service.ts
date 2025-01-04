import { Inject, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../entities/note.entity';
import { Repository } from 'typeorm';
import { constants } from '../constants/notes.constants';
import { CustomException } from '../../common/exceptions/custom.exception';
import { CreateNoteDto, UpdateNoteDto } from '../dto/notes.dto';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';

const { RESPONSES, NOTES_CACHE_KEY, NOTES_CACHE_DURATION_MS } = constants;

@Injectable()
export class NotesService {
  private readonly logger = new Logger(NotesService.name);
  constructor(
    @InjectRepository(Note)
    private noteRepository: Repository<Note>,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
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

  /**
   * This version implements NestJs cache manager
   * @returns
   */
  async getAllV2(): Promise<Note[]> {
    const cachedNotes: Note[] = await this.cacheManager.get(NOTES_CACHE_KEY);
    if (!cachedNotes) {
      this.logger.debug('Cache was not found, create new one');
      const notes = await this.getAll();
      await this.cacheManager.set(
        NOTES_CACHE_KEY,
        notes,
        NOTES_CACHE_DURATION_MS,
      );
      return notes;
    }
    this.logger.debug('Cache was found, return cached notes');
    return cachedNotes;
  }
}
