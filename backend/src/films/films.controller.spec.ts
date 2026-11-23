import { Test } from '@nestjs/testing';

import { FilmDto, ScheduleDto } from './dto/films.dto';
import { FilmsController } from './films.controller';
import { FilmsService } from './films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let filmsService: { getAllFilms: jest.Mock; getFilmSchedule: jest.Mock };

  const film: FilmDto = {
    id: '6b1f8f4b-5f5c-4c9f-9c9f-1f6c6f4c6f4c',
    rating: 8,
    director: 'Режиссёр',
    tags: ['драма'],
    title: 'Название',
    about: 'О фильме',
    description: 'Описание',
    image: '/content/afisha/image.jpg',
    cover: '/content/afisha/cover.jpg',
  };

  const schedule: ScheduleDto = {
    id: '1b1f8f4b-5f5c-4c9f-9c9f-1f6c6f4c6f4c',
    daytime: '2024-10-01T12:00:00.000Z',
    hall: 1,
    rows: 10,
    seats: 12,
    price: 300,
    taken: ['1:1'],
  };

  beforeEach(async () => {
    filmsService = {
      getAllFilms: jest.fn(),
      getFilmSchedule: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [{ provide: FilmsService, useValue: filmsService }],
    }).compile();

    controller = moduleRef.get(FilmsController);
  });

  describe('getAll', () => {
    it('возвращает список фильмов из сервиса', async () => {
      const response = { total: 1, items: [film] };
      filmsService.getAllFilms.mockResolvedValue(response);

      await expect(controller.getAll()).resolves.toEqual(response);
      expect(filmsService.getAllFilms).toHaveBeenCalledTimes(1);
      expect(filmsService.getAllFilms).toHaveBeenCalledWith();
    });

    it('возвращает пустой список, когда фильмов нет', async () => {
      filmsService.getAllFilms.mockResolvedValue({ total: 0, items: [] });

      await expect(controller.getAll()).resolves.toEqual({
        total: 0,
        items: [],
      });
    });
  });

  describe('getSchedule', () => {
    it('передаёт id фильма в сервис и возвращает расписание', async () => {
      const response = { total: 1, items: [schedule] };
      filmsService.getFilmSchedule.mockResolvedValue(response);

      await expect(controller.getSchedule(film.id)).resolves.toEqual(response);
      expect(filmsService.getFilmSchedule).toHaveBeenCalledTimes(1);
      expect(filmsService.getFilmSchedule).toHaveBeenCalledWith(film.id);
    });

    it('возвращает пустое расписание для фильма без сеансов', async () => {
      filmsService.getFilmSchedule.mockResolvedValue({ total: 0, items: [] });

      await expect(controller.getSchedule(film.id)).resolves.toEqual({
        total: 0,
        items: [],
      });
    });
  });
});
