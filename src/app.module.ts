import { Module } from '@nestjs/common';
import { NotesModule } from './notes/notes.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import config from './config';
import * as Joi from 'joi';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [config],
      validationSchema: Joi.object({
        DB_DATABASE: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_HOST: Joi.string().required(),
        DB_TYPE: Joi.string().required(),
      }),
    }),
    NotesModule,
    DatabaseModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}
