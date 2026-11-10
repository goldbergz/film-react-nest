import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CONFIG, AppConfig } from '../app.config.provider';
import { ConfigModule } from '../config/config.module';
import { FilmsRepository } from './films.repository';
import { AppRepository } from './app.repository';
import { FilmEntity } from './postgres/film.entity';
import { ScheduleEntity } from './postgres/schedule.entity';

const POSTGRES_DRIVER = 'postgres';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [CONFIG],
      useFactory: (config: AppConfig) => {
        if (config.database.driver !== POSTGRES_DRIVER) {
          throw new Error(
            `Не поддерживаемый DATABASE_DRIVER: "${config.database.driver}". ` +
              `Поддерживается только "${POSTGRES_DRIVER}".`,
          );
        }

        return {
          type: 'postgres' as const,
          url: config.database.url,
          username: config.database.username,
          password: config.database.password,
          entities: [FilmEntity, ScheduleEntity],
          synchronize: false,
        };
      },
    }),
    TypeOrmModule.forFeature([FilmEntity, ScheduleEntity]),
  ],
  providers: [{ provide: FilmsRepository, useClass: AppRepository }],
  exports: [FilmsRepository],
})
export class RepositoryModule {}
