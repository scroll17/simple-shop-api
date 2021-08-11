import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ArticleModule } from './modules/article/article.module';
import { AuthModule } from './modules/auth/auth.module';
import { Article } from '@entities/article/article.entity';
import { User } from '@entities/user/user.entity';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { CatsModule } from './modules/cats/cats.module';
import { CatsController } from './modules/cats/cats.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: `postgresql://test:test@database:5432/simple_shop`,
      entities: [Article, User],
      logging: true,
      synchronize: true,
      /**
       * Эта настройка означает, что при каждом запуске приложения
       * схема БД будет приобретать ту форму, которую мы описываем в коде (классы, помеченные @Entity)
       * */
    }),
    ArticleModule,
    AuthModule,
    CatsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes(CatsController);
  }
}
