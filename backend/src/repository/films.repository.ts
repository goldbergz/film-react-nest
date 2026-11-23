import { FilmModel } from './film.model';

export abstract class FilmsRepository {
  abstract findAll(): Promise<FilmModel[]>;

  abstract findById(id: string): Promise<FilmModel | null>;

  abstract bookSeat(
    filmId: string,
    sessionId: string,
    seat: string,
  ): Promise<FilmModel | null>;
}
