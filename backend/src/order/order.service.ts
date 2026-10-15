import { Injectable } from '@nestjs/common';

import {
  CreateOrderDto,
  OrderResponseDto,
  TicketWithIdDto,
} from './dto/order.dto';

@Injectable()
export class OrderService {
  // @todo: заменить заглушку на обращение к репозиторию
  async createOrder(dto: CreateOrderDto): Promise<OrderResponseDto> {
    const items: TicketWithIdDto[] = dto.tickets.map((ticket) => ({
      ...ticket,
      id: '00000000-0000-0000-0000-000000000000',
    }));

    return { total: items.length, items };
  }
}
