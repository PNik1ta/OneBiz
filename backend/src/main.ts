import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import { Request, Response } from 'express';
import { ElasticsearchLoggerService } from './logger.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const loggerService = app.get(ElasticsearchLoggerService);

  app.enableCors({
    origin: ['http://localhost:3000', 'http://www.localhost:3000'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Ambition marketing')
    .setDescription('Ambition marketing API description')
    .setVersion('1.0')
    .addTag('ambition')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.use((req: Request, res: Response, next) => {
    express.json()(req, res, () => {
      if (req.url !== '/metrics') {
        loggerService.logHTTPRequest(
          req.method,
          req.url,
          JSON.stringify(req.body),
          res.statusCode,
        );
      }
      next();
    });
  });

  await app.listen(5000);
}
bootstrap();
