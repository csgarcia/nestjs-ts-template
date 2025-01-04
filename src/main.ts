import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './common/interceptors/response.interceptors';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { swaggerConfig } from './swagger.config';
import { GeneralResponseDto } from './common/decorators/response-docs.decorator';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'debug'],
  });

  // To use validation pipes
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
  });
  app.enableCors();

  // Api Docs
  const document = SwaggerModule.createDocument(app, swaggerConfig, {
    ignoreGlobalPrefix: true,
    extraModels: [GeneralResponseDto],
  });
  SwaggerModule.setup('docs', app, document);

  // Interceptors
  app.useGlobalInterceptors(new ResponseInterceptor());

  await app.listen(process.env.PORT || 3000);
}
bootstrap();
