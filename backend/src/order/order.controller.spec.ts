import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';

import { CreateOrderDto, OrderResponseDto } from './dto/order.dto';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';

describe('OrderController', () => {
  let controller: OrderController;
  let orderService: { createOrder: jest.Mock };

  const dto: CreateOrderDto = {
    email: 'user@example.com',
    phone: '+7 900 000-00-00',
    tickets: [
      {
        film: '6b1f8f4b-5f5c-4c9f-9c9f-1f6c6f4c6f4c',
        session: '1b1f8f4b-5f5c-4c9f-9c9f-1f6c6f4c6f4c',
        daytime: '2024-10-01T12:00:00.000Z',
        row: 1,
        seat: 2,
        price: 300,
      },
    ],
  };

  const response: OrderResponseDto = {
    total: 1,
    items: [
      {
        ...dto.tickets[0],
        id: '3c2f8f4b-5f5c-4c9f-9c9f-1f6c6f4c6f4c',
      },
    ],
  };

  beforeEach(async () => {
    orderService = {
      createOrder: jest.fn(),
    };

    const moduleRef = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [{ provide: OrderService, useValue: orderService }],
    }).compile();

    controller = moduleRef.get(OrderController);
  });

  describe('createOrder', () => {
    it('передаёт dto в сервис и возвращает созданный заказ', async () => {
      orderService.createOrder.mockResolvedValue(response);

      await expect(controller.createOrder(dto)).resolves.toEqual(response);
      expect(orderService.createOrder).toHaveBeenCalledTimes(1);
      expect(orderService.createOrder).toHaveBeenCalledWith(dto);
    });

    it('пробрасывает ошибку сервиса без изменений', async () => {
      orderService.createOrder.mockRejectedValue(
        new BadRequestException('Место 1:2 на сеансе уже занято'),
      );

      await expect(controller.createOrder(dto)).rejects.toThrow(
        BadRequestException,
      );
      await expect(controller.createOrder(dto)).rejects.toThrow(
        'Место 1:2 на сеансе уже занято',
      );
    });
  });
});
