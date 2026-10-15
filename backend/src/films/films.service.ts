import { Injectable } from '@nestjs/common';

import {
  FilmDto,
  FilmsResponseDto,
  ScheduleResponseDto,
} from './dto/films.dto';

@Injectable()
export class FilmsService {
  // @todo: заменить заглушку на обращение к репозиторию
  async getAllFilms(): Promise<FilmsResponseDto> {
    const films: FilmDto[] = [];

    return { total: films.length, items: films };
  }

  // @todo: заменить заглушку на обращение к репозиторию (id понадобится для поиска фильма)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async getFilmSchedule(id: string): Promise<ScheduleResponseDto> {
    const schedule: ScheduleResponseDto['items'] = [];

    return { total: schedule.length, items: schedule };
  }
}
