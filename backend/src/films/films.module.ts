import { Module } from '@nestjs/common';

import { RepositoryModule } from '../repository/repository.module';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';

@Module({
  imports: [RepositoryModule],
  providers: [FilmsService],
  controllers: [FilmsController],
  exports: [RepositoryModule],
})
export class FilmsModule {}
