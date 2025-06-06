import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './shared/guards/at.guard';
import { BusinessModule } from './business/business.module';
import { FilesModule } from './file/file.module';
import { BookingModule } from './booking/booking.module';
import { ServiceModule } from './service/service.module';
import { User } from './user/models/user.model';
import { Business } from './business/models/business.model';
import { Booking } from './booking/models/booking.model';
import { Service } from './service/models/service.model';
import { Review } from './review/models/review.model';
import { Comment } from './comment/models/comment.model';
import { ReviewModule } from './review/review.module';
import { Tag } from './tag/models/tag.model';
import { TagModule } from './tag/tag.module';
import { PostModule } from './post/post.module';
import { Post } from './post/models/post.model';
import { Like } from './like/models/like.model';
import { LikeModule } from './like/like.module';
import { CommentModule } from './comment/comment.module';
import { ElasticsearchLoggerService } from './logger.service';
import { VerificationModule } from './mail/verification.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { City } from './city/models/city.model';
import { CityModule } from './city/city.module';
import { PrometheusModule } from '@willsoto/nestjs-prometheus';
import { LoggerModule } from 'nestjs-pino';
import { stdTimeFunctions } from 'pino';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrometheusModule.register({
      defaultMetrics: {
        enabled: true,
      },
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        timestamp: stdTimeFunctions.isoTime,
        level: process.env.NODE_ENV !== 'production' ? 'trace' : 'info',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: 5432,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DB,
      synchronize: true,
      entities: [
        User,
        Business,
        Booking,
        Service,
        Review,
        Tag,
        Post,
        Like,
        Comment,
        City,
      ],
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: 'npozdeyev@gmail.com',
          pass: 'jlyy hwfo nelr ozdx',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@gmail.com>',
      },
    }),
    FilesModule,
    UserModule,
    AuthModule,
    BusinessModule,
    BookingModule,
    ServiceModule,
    ReviewModule,
    TagModule,
    PostModule,
    LikeModule,
    CommentModule,
    VerificationModule,
    CityModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AtGuard },
    ElasticsearchLoggerService,
  ],
})
export class AppModule {}
