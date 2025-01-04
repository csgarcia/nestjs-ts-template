import { HttpStatus } from '@nestjs/common';

export const constants = {
  NOTES_CACHE_DURATION_MS: 60000, // 1 min 
  NOTES_CACHE_KEY: 'NOTES_CACHE_KEY',
  RESPONSES: {
    NOT_FOUND: {
      code: 1000,
      message: 'Note not found',
      http_code: HttpStatus.NOT_FOUND,
    },
  },
};
