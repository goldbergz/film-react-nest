import { ConfigService } from '@nestjs/config';

export const CONFIG = 'CONFIG';

export const configProvider = {
  provide: CONFIG,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): AppConfig => ({
    database: {
      driver: configService.getOrThrow<string>('DATABASE_DRIVER'),
      url: configService.getOrThrow<string>('DATABASE_URL'),
    },
  }),
};

export interface AppConfig {
  database: AppConfigDatabase;
}

export interface AppConfigDatabase {
  driver: string;
  url: string;
}
