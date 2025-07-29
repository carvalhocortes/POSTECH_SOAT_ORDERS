import { Request, Response } from 'express';
import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrder.useCase';
import { DeleteOrderUseCase } from '@application/use-cases/order/DeleteOrder.useCase';
import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderById.useCase';
import { GetOrderByNumberUseCase } from '@application/use-cases/order/GetOrderByNumber.useCase';
import { ListOrdersUseCase } from '@application/use-cases/order/ListOrders.useCase';
import { CreateOrderDTO } from '@application/dto/order/CreateOrder.dto';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class OrderController {
  constructor(
    private readonly createOrderUseCase: CreateOrderUseCase,
    private readonly listOrdersUseCase: ListOrdersUseCase,
    private readonly getOrderByIdUseCase: GetOrderByIdUseCase,
    private readonly getOrderByNumberUseCase: GetOrderByNumberUseCase,
    private readonly deleteOrderUseCase: DeleteOrderUseCase,
  ) {}

  createOrder = async (req: Request, res: Response): Promise<void> => {
    const dto = CreateOrderDTO.create(req);
    const order = await this.createOrderUseCase.execute(dto);
    res.status(201).json(order);
  };

  getOrderById = async ({ params }: Request, res: Response): Promise<void> => {
    const order = await this.getOrderByIdUseCase.execute(params.id);
    if (!order) throw new NotFoundError(`Order with ID ${params.id} not found`);
    res.json(order);
  };

  getOrderByNumber = async ({ params }: Request, res: Response): Promise<void> => {
    const order = await this.getOrderByNumberUseCase.execute(Number(params.orderNumber));
    if (!order) throw new NotFoundError(`Order with number ${params.orderNumber} not found`);
    res.json(order);
  };

  listOrders = async (_: Request, res: Response): Promise<void> => {
    const orders = await this.listOrdersUseCase.execute();
    res.json(orders);
  };

  deleteOrder = async ({ params }: Request, res: Response): Promise<void> => {
    await this.deleteOrderUseCase.execute(params.id);
    res.sendStatus(204);
  };
}
