import { DocumentBuilder } from '@nestjs/swagger';

let swaggerConfig = new DocumentBuilder()
  .setTitle('API Service')
  .setDescription('Add some description about your API')
  .setVersion('1.0')
  // .addApiKey({
  //   type: 'apiKey',
  //   name: 'some-header-name-key',
  //   in: 'header',
  //   description:
  //     'Example api key',
  // })
  .addServer(`http://localhost:${process.env.PORT}/api`, 'local dev')
  .build();

export { swaggerConfig };
