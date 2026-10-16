import { Module } from '@nestjs/common';
import { ConfigModule as NestConfigModule } from '@nestjs/config';

import { configProvider } from '../app.config.provider';

@Module({
  imports: [NestConfigModule],
  providers: [configProvider],
  exports: [configProvider],
})
export class ConfigModule {}
