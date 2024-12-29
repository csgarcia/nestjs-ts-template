import { Global, Module } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';

@Global()
@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigType<typeof config>) => {
        const {
          host,
          database,
          password,
          port,
          username,
          entities,
          autoLoadEntities,
          synchronize,
          logging,
        } = configService.database;
        return {
          type: 'postgres',
          host,
          port,
          database,
          password,
          username,
          entities,
          synchronize,
          logging,
          autoLoadEntities,
        };
      },
      inject: [config.KEY],
    }),
  ],
  exports: [TypeOrmModule],
})
export class DatabaseModule {}
