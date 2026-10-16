import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Film, FilmSchema } from '../repository/film.schema';
import { FilmsRepository } from '../repository/films.repository';
import { FilmsService } from './films.service';
import { FilmsController } from './films.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Film.name, schema: FilmSchema }]),
  ],
  providers: [FilmsService, FilmsRepository],
  controllers: [FilmsController],
})
export class FilmsModule {}
