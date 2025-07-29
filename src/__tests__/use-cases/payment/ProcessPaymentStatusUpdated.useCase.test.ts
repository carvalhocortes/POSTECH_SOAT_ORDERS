import { ProcessPaymentStatusUpdatedUseCase } from '../../../application/use-cases/payment/ProcessPaymentStatusUpdated.useCase';
import { NotFoundError } from '../../../shared/errors/NotFoundError';
import { Order } from '../../../core/entities/order.entity';

describe('ProcessPaymentStatusUpdatedUseCase test', () => {
  let orderRepository: any;
  let snsPublisher: any;
  let useCase: ProcessPaymentStatusUpdatedUseCase;
  let order: Order;

  beforeEach(() => {
    order = {
      id: 'order-1',
      updatePayment: jest.fn(),
    } as unknown as Order;

    orderRepository = {
      findById: jest.fn(),
      update: jest.fn(),
    };
    snsPublisher = {
      publish: jest.fn(),
    };
    useCase = new ProcessPaymentStatusUpdatedUseCase(orderRepository, snsPublisher);
  });

  it('should throw NotFoundError if the order is not found', async () => {
    orderRepository.findById.mockResolvedValue(null);
    await expect(useCase.execute({ id: 'payment-1', orderId: 'order-1', status: 'paid' })).rejects.toThrow(NotFoundError);
  });

  it('should update the payment status and publish the event', async () => {
    orderRepository.findById.mockResolvedValue(order);
    orderRepository.update.mockResolvedValue(order);

    const result = await useCase.execute({ id: 'payment-1', orderId: 'order-1', status: 'paid' });

    expect(order.updatePayment).toHaveBeenCalledWith('paid');
    expect(snsPublisher.publish).toHaveBeenCalledWith({
      eventType: 'PAYMENT_STATUS_UPDATED',
      payload: order,
    });
    expect(orderRepository.update).toHaveBeenCalledWith('order-1', order);
    expect(result).toBe(order);
  });
});
