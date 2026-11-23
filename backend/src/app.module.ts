import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule as NestConfigModule } from '@nestjs/config';
import * as path from 'node:path';

import { ConfigModule } from './config/config.module';
import { RepositoryModule } from './repository/repository.module';
import { FilmsModule } from './films/films.module';
import { OrderModule } from './order/order.module';

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      exclude: ['/(.*)'],
    }),
    ConfigModule,
    RepositoryModule,
    FilmsModule,
    OrderModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
