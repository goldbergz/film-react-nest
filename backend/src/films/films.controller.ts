import { Controller, Get, Param } from '@nestjs/common';

import { FilmsService } from './films.service';
import { FilmsResponseDto, ScheduleResponseDto } from './dto/films.dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async getAll(): Promise<FilmsResponseDto> {
    return await this.filmsService.getAllFilms();
  }

  @Get(':id/schedule')
  async getSchedule(@Param('id') id: string): Promise<ScheduleResponseDto> {
    return await this.filmsService.getFilmSchedule(id);
  }
}
