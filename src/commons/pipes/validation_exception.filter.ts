import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequestException,
} from '@nestjs/common';
import { isArray } from 'class-validator';

@Catch(BadRequestException)
export class ValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    const exceptionResponse: string | any = exception.getResponse();

    if (
      isArray(exceptionResponse?.message) &&
      exceptionResponse?.message?.length
    ) {
      exceptionResponse.message = exceptionResponse.message[0];

      response
        .status(status)
        .json(new BadRequestException(exceptionResponse.message));
      return;
    }

    response.status(status).json(new BadRequestException(exceptionResponse));

    return;
  }
}
