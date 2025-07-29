import { SqsListener } from '@infrastructure/external/sqsListener';
import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatus.useCase';
import { ProcessPaymentStatusUpdatedUseCase } from '@application/use-cases/payment/ProcessPaymentStatusUpdated.useCase';
import { DynamoOrderRepository } from '@infrastructure/db/repositories/OrderRepository.db';
import { SnsPublisher } from '@infrastructure/external/snsPublisher';

export function createSqsListener(queueUrl: string, topicArn: string): SqsListener {
  const orderRepository = new DynamoOrderRepository();
  const snsPublisher = new SnsPublisher(topicArn);
  const processPaymentStatusUpdatedUseCase = new ProcessPaymentStatusUpdatedUseCase(orderRepository, snsPublisher);
  const updateOrderStatusUseCase = new UpdateOrderStatusUseCase(orderRepository);
  return new SqsListener(queueUrl, processPaymentStatusUpdatedUseCase, updateOrderStatusUseCase);
}
