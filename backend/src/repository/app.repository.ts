import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FilmModel } from './film.model';
import { FilmsRepository } from './films.repository';
import { FilmEntity } from './postgres/film.entity';
import { ScheduleEntity } from './postgres/schedule.entity';

function toFilmModel(film: FilmEntity): FilmModel {
  return {
    id: film.id,
    rating: film.rating,
    director: film.director,
    tags: film.tags ?? [],
    title: film.title,
    about: film.about,
    description: film.description,
    image: film.image,
    cover: film.cover,
    schedule: (film.schedule ?? []).map((session) => ({
      id: session.id,
      daytime: new Date(session.daytime),
      hall: session.hall,
      rows: session.rows,
      seats: session.seats,
      price: session.price,
      taken: session.taken ?? [],
    })),
  };
}

@Injectable()
export class AppRepository extends FilmsRepository {
  constructor(
    @InjectRepository(FilmEntity)
    private readonly filmRepository: Repository<FilmEntity>,
    @InjectRepository(ScheduleEntity)
    private readonly scheduleRepository: Repository<ScheduleEntity>,
  ) {
    super();
  }

  async findAll(): Promise<FilmModel[]> {
    const films = await this.filmRepository.find({
      relations: { schedule: true },
    });
    return films.map(toFilmModel);
  }

  async findById(id: string): Promise<FilmModel | null> {
    const film = await this.filmRepository.findOne({
      where: { id },
      relations: { schedule: true },
    });
    return film ? toFilmModel(film) : null;
  }

  async bookSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<FilmModel | null> {
    const schedule = await this.scheduleRepository.findOne({
      where: { id: sessionId, film: { id: filmId } },
    });
    if (!schedule || schedule.taken.includes(seat)) {
      return null;
    }

    schedule.taken = [...schedule.taken, seat];
    await this.scheduleRepository.save(schedule);

    return this.findById(filmId);
  }
}
