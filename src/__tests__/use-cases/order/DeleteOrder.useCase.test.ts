import { DeleteOrderUseCase } from '@application/use-cases/order/DeleteOrder.useCase';

describe('DeleteOrderUseCase Test', () => {
  let orderRepository: any;
  let useCase: DeleteOrderUseCase;

  beforeEach(() => {
    orderRepository = { delete: jest.fn() };
    useCase = new DeleteOrderUseCase(orderRepository);
  });

  it('should call repository delete with correct id', async () => {
    await useCase.execute('order-1');
    expect(orderRepository.delete).toHaveBeenCalledWith('order-1');
  });
});
