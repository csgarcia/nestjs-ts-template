import { ApiProperty } from '@nestjs/swagger';
import { Note } from '../entities/note.entity';

export class NotesResponseDto extends Note {}
