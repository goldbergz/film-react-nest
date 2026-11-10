import { Injectable } from '@nestjs/common';

import { FilmsRepository } from '../repository/films.repository';
import { FilmModel } from '../repository/film.model';
import {
  FilmDto,
  FilmsResponseDto,
  ScheduleResponseDto,
} from './dto/films.dto';
import { toFilmDto, toScheduleDto } from './dto/films.mapper';

@Injectable()
export class FilmsService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async getAllFilms(): Promise<FilmsResponseDto> {
    const films: FilmModel[] = await this.filmsRepository.findAll();
    const items: FilmDto[] = films.map(toFilmDto);

    return { total: items.length, items };
  }

  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    const film = await this.filmsRepository.findById(id);
    const items = (film?.schedule ?? []).map(toScheduleDto);

    return { total: items.length, items };
  }
}
