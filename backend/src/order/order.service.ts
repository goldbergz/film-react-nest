import { BadRequestException, Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';

import { FilmDocument } from '../repository/film.schema';
import { FilmsRepository } from '../repository/films.repository';
import {
  CreateOrderDto,
  OrderResponseDto,
  TicketDto,
  TicketWithIdDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  constructor(private readonly filmsRepository: FilmsRepository) {}

  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const plan = await this.validateOrder(dto.tickets);

    const items: TicketWithIdDto[] = [];
    for (const [ticket, seat] of plan) {
      const updatedFilm = await this.filmsRepository.bookSeat(
        ticket.film,
        ticket.session,
        seat,
      );
      if (!updatedFilm) {
        throw new BadRequestException(`Место ${seat} на сеансе уже занято`);
      }
      items.push({ ...ticket, id: randomUUID() });
    }

    return { total: items.length, items };
  }

  private async validateOrder(
    tickets: TicketDto[],
  ): Promise<Array<[TicketDto, string]>> {
    const films = new Map<string, FilmDocument>();
    const seatsInOrder = new Set<string>();
    const plan: Array<[TicketDto, string]> = [];

    for (const ticket of tickets) {
      const seat = `${ticket.row}:${ticket.seat}`;

      let film = films.get(ticket.film);
      if (!film) {
        film = await this.filmsRepository.findById(ticket.film);
        if (!film) {
          throw new BadRequestException(`Фильм ${ticket.film} не найден`);
        }
        films.set(ticket.film, film);
      }

      const session = film.schedule.find((item) => item.id === ticket.session);
      if (!session) {
        throw new BadRequestException(
          `Сеанс ${ticket.session} у фильма ${film.title} не найден`,
        );
      }

      const rowIsValid = ticket.row >= 1 && ticket.row <= session.rows;
      const seatIsValid = ticket.seat >= 1 && ticket.seat <= session.seats;
      if (!rowIsValid || !seatIsValid) {
        throw new BadRequestException(
          `Место ${seat} не существует: на сеансе ${session.rows} рядов по ${session.seats} мест`,
        );
      }

      const orderSeatKey = `${ticket.film}:${ticket.session}:${seat}`;
      if (seatsInOrder.has(orderSeatKey)) {
        throw new BadRequestException(
          `Место ${seat} уже выбрано в этом заказе`,
        );
      }
      seatsInOrder.add(orderSeatKey);

      if (session.taken.includes(seat)) {
        throw new BadRequestException(`Место ${seat} на сеансе уже занято`);
      }

      plan.push([ticket, seat]);
    }

    return plan;
  }
}
