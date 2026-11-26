import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { createLogger } from './logger.factory';

export const APP_LOGGER = 'APP_LOGGER';

@Global()
@Module({
  providers: [
    {
      provide: APP_LOGGER,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        createLogger(configService.get<string>('LOG_FORMAT')),
    },
  ],
  exports: [APP_LOGGER],
})
export class LoggerModule {}
