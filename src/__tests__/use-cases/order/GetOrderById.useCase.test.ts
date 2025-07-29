import { GetOrderByIdUseCase } from '@application/use-cases/order/GetOrderById.useCase';
import { NotFoundError } from '@shared/errors/NotFoundError';

describe('GetOrderByIdUseCase Test', () => {
  let orderRepository: any;
  let useCase: GetOrderByIdUseCase;

  beforeEach(() => {
    orderRepository = { findById: jest.fn() };
    useCase = new GetOrderByIdUseCase(orderRepository);
  });

  it('should throw NotFoundError if order is not found', async () => {
    orderRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute('order-1')).rejects.toThrow(NotFoundError);
  });

  it('should return the order if found', async () => {
    const order = { id: 'order-1' };
    orderRepository.findById.mockResolvedValue(order);
    const result = await useCase.execute('order-1');
    expect(result).toBe(order);
  });
});
