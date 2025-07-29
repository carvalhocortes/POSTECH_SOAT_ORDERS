import { CreateOrderUseCase } from '@application/use-cases/order/CreateOrder.useCase';
import { NotFoundError } from '@shared/errors/NotFoundError';
import { Order } from '@core/entities/order.entity';

describe('CreateOrderUseCase Test', () => {
  let orderRepository: any;
  let productRepository: any;
  let customerRepository: any;
  let counterRepository: any;
  let useCase: CreateOrderUseCase;

  beforeEach(() => {
    orderRepository = { save: jest.fn() };
    productRepository = { findById: jest.fn() };
    customerRepository = { findById: jest.fn() };
    counterRepository = { getNextSequenceNumber: jest.fn() };
    useCase = new CreateOrderUseCase(orderRepository, productRepository, customerRepository, counterRepository);
  });

  it('should throw NotFoundError if customer does not exist', async () => {
    customerRepository.findById.mockResolvedValue(null);
    const dto = { customerId: 'c1', products: [{ id: 'p1', quantity: 1 }] };
    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError if any product does not exist', async () => {
    customerRepository.findById.mockResolvedValue({});
    productRepository.findById.mockResolvedValueOnce(null);
    const dto = { customerId: 'c1', products: [{ id: 'p1', quantity: 1 }] };
    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundError);
  });

  it('should create and save order with correct total and order number', async () => {
    customerRepository.findById.mockResolvedValue({});
    productRepository.findById.mockResolvedValue({ price: 10 });
    counterRepository.getNextSequenceNumber = jest.fn().mockResolvedValue(42);
    orderRepository.save.mockImplementation((order: Order) => order);
    const dto = { customerId: 'c1', products: [{ id: 'p1', quantity: 2 }] };
    const result = await useCase.execute(dto);
    expect(result.total).toBe(20);
    expect(result.orderNumber).toBe(1);
    expect(orderRepository.save).toHaveBeenCalled();
  });
});
