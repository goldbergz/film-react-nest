import { LoggerService } from '@nestjs/common';

import { DevLogger } from './dev.logger';
import { JsonLogger } from './json.logger';
import { TskvLogger } from './tskv.logger';

export const LOG_FORMAT_DEV = 'dev';
export const LOG_FORMAT_JSON = 'json';
export const LOG_FORMAT_TSKV = 'tskv';

const SUPPORTED_FORMATS = [LOG_FORMAT_DEV, LOG_FORMAT_JSON, LOG_FORMAT_TSKV];

export function createLogger(format?: string): LoggerService {
  switch (format) {
    case LOG_FORMAT_JSON:
      return new JsonLogger();
    case LOG_FORMAT_TSKV:
      return new TskvLogger();
    case undefined:
    case LOG_FORMAT_DEV:
      return new DevLogger();
    default:
      throw new Error(
        `Не поддерживаемый LOG_FORMAT: "${format}". ` +
          `Поддерживаются: ${SUPPORTED_FORMATS.join(', ')}.`,
      );
  }
}
