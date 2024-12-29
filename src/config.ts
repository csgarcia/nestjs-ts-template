import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { DataSource, DataSourceOptions } from 'typeorm';

const config = {
  database: {
    type: 'postgres',
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: parseInt(process.env.DB_PORT, 10),
    host: process.env.DB_HOST,
    entities: [join(__dirname, '**', '*.entity.{ts,js}')],
    migrations: ['src/database/migrations/**/*{.ts,.js}'],
    autoLoadEntities: true, // If true, entities will be loaded automatically (default: false)
    // For production usage I recommend put synchronize as false, to migrate entities and execute them more with more managment
    synchronize: false, //If true, automatically loaded models(Entities) will be synchronized (default: true)
    logging: true,
  },
};

export default registerAs('config', () => config);

// Db Connection source
const realDbDataSource = new DataSource(config.database as DataSourceOptions);
export const connectionSource = realDbDataSource;
