import { ProcessPaymentStatusUpdatedDTO } from '@application/dto/payment/ProcessPaymentStatusUpdated.dto';
import { Order } from '@core/entities/order.entity';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';
import { OrderRepository } from '@interfaces/gateways/OrderRepository.gateway';
import { NotFoundError } from '@shared/errors/NotFoundError';

export class ProcessPaymentStatusUpdatedUseCase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly snsPublisher: SnsPublisher,
  ) {}

  async execute({ orderId, status }: ProcessPaymentStatusUpdatedDTO): Promise<Order | null> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundError('Order not found');
    }

    order.updatePayment(status);

    await this.snsPublisher.publish({
      eventType: 'PAYMENT_STATUS_UPDATED',
      payload: order,
    });

    return this.orderRepository.update(order.id!, order);
  }
}
