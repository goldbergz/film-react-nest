import { FilmDocument, Schedule } from '../../repository/film.schema';
import { FilmDto, ScheduleDto } from './films.dto';

export function toScheduleDto(schedule: Schedule): ScheduleDto {
  return {
    id: schedule.id,
    daytime: new Date(schedule.daytime).toISOString(),
    hall: String(schedule.hall),
    rows: schedule.rows,
    seats: schedule.seats,
    price: schedule.price,
    taken: schedule.taken ?? [],
  };
}

export function toFilmDto(film: FilmDocument): FilmDto {
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
  };
}
