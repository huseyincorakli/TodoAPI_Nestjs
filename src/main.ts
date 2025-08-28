import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { LoggingInterceptor } from './common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({
    whitelist:true
  }))

  app.useGlobalInterceptors(new LoggingInterceptor())

  // const configService = app.get(ConfigService);
  // app.useGlobalGuards(new RateLimitGuard(configService))

  //#region  Swagger Configuration

    const config = new DocumentBuilder()
    .setTitle('TODO API - Docs')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'Authorization',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth', 
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  
  SwaggerModule.setup('swagger', app, document, {
    swaggerOptions: {
      persistAuthorization: true, 
      securityDefinitions: {
        Bearer: {
          type: 'apiKey',
          name: 'Authorization',
          in: 'header',
          description: 'JWT Authorization header using the Bearer scheme. Example: "Bearer {token}"'
        }
      }
    },
  });
  //#endregion
 
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
