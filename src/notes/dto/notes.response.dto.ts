import { ApiProperty } from '@nestjs/swagger';

export class NotesResponseDto {
  @ApiProperty()
  id: string;
  @ApiProperty()
  description: string;
}
