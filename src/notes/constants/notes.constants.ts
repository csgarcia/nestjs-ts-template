import { HttpStatus } from '@nestjs/common';

export const constants = {
  RESPONSES: {
    NOT_FOUND: {
      code: 1000,
      message: 'Note not found',
      http_code: HttpStatus.NOT_FOUND,
    },
  },
};
