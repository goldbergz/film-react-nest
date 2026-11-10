import { ConfigService } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.get<string>('DATABASE_DRIVER') ?? 'postgres',
      url: configService.getOrThrow<string>('DATABASE_URL'),
      username: configService.getOrThrow<string>('DATABASE_USERNAME'),
      password: configService.getOrThrow<string>('DATABASE_PASSWORD'),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
  username: string;
  password: string;
}
