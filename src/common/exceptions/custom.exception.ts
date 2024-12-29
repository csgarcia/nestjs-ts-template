import { HttpException, HttpStatus } from '@nestjs/common';
import { GeneralResponseDto } from '../decorators/response-docs.decorator';

export class CustomException extends HttpException {
  constructor(
    internal_code: number,
    message: string,
    http_code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    data: any = {},
  ) {
    const response: GeneralResponseDto = {
      code: internal_code,
      message,
      data,
    };
    super(response, http_code);
  }
}
