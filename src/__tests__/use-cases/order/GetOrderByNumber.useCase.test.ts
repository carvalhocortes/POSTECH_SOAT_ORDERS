import { GetOrderByNumberUseCase } from '@application/use-cases/order/GetOrderByNumber.useCase';
import { NotFoundError } from '@shared/errors/NotFoundError';

describe('GetOrderByNumberUseCase Test', () => {
  let orderRepository: any;
  let useCase: GetOrderByNumberUseCase;

  beforeEach(() => {
    orderRepository = { findByNumber: jest.fn() };
    useCase = new GetOrderByNumberUseCase(orderRepository);
  });

  it('should throw NotFoundError if order is not found', async () => {
    orderRepository.findByNumber.mockResolvedValue(null);
    await expect(useCase.execute(123)).rejects.toThrow(NotFoundError);
  });

  it('should return the order if found', async () => {
    const order = { orderNumber: 123 };
    orderRepository.findByNumber.mockResolvedValue(order);
    const result = await useCase.execute(123);
    expect(result).toBe(order);
  });
});
