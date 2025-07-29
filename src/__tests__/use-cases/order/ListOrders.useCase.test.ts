import { ListOrdersUseCase } from '@application/use-cases/order/ListOrders.useCase';

describe('ListOrdersUseCase Test', () => {
  let orderRepository: any;
  let useCase: ListOrdersUseCase;

  beforeEach(() => {
    orderRepository = { findAll: jest.fn() };
    useCase = new ListOrdersUseCase(orderRepository);
  });

  it('should filter out completed and cancelled orders and sort by status and createdAt', async () => {
    const orders = [
      { id: '1', status: 'completed', createdAt: new Date('2023-01-01') },
      { id: '2', status: 'ready', createdAt: new Date('2023-01-02') },
      { id: '3', status: 'in_preparation', createdAt: new Date('2023-01-03') },
      { id: '4', status: 'received', createdAt: new Date('2023-01-04') },
      { id: '5', status: 'cancelled', createdAt: new Date('2023-01-05') },
      { id: '6', status: 'ready', createdAt: new Date('2023-01-01') },
    ];
    orderRepository.findAll.mockResolvedValue(orders);
    const result = await useCase.execute();
    expect(result.map((o) => o.id)).toEqual(['6', '2', '3', '4']);
  });
});
