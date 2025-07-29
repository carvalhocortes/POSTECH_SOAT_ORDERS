import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatus.useCase';
import { NotFoundError } from '@shared/errors/NotFoundError';

describe('UpdateOrderStatusUseCase Test', () => {
  let orderRepository: any;
  let useCase: UpdateOrderStatusUseCase;
  let order: any;

  beforeEach(() => {
    order = { id: 'order-1', updateStatus: jest.fn() };
    orderRepository = { findById: jest.fn(), update: jest.fn() };
    useCase = new UpdateOrderStatusUseCase(orderRepository);
  });

  it('should throw NotFoundError if order is not found', async () => {
    orderRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: 'order-1', status: 'ready' })).rejects.toThrow(NotFoundError);
  });

  it('should update order status and persist', async () => {
    orderRepository.findById.mockResolvedValue(order);
    orderRepository.update.mockResolvedValue(order);
    const result = await useCase.execute({ id: 'order-1', status: 'ready' });
    expect(order.updateStatus).toHaveBeenCalledWith('ready');
    expect(orderRepository.update).toHaveBeenCalledWith('order-1', order);
    expect(result).toBe(order);
  });
});
