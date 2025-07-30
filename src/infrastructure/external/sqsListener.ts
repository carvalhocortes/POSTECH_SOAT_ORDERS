import { SQSClient, ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { UpdateOrderStatusUseCase } from '@application/use-cases/order/UpdateOrderStatus.useCase';
import { ProcessPaymentStatusUpdatedUseCase } from '@application/use-cases/payment/ProcessPaymentStatusUpdated.useCase';

export class SqsListener {
  private sqs: SQSClient;
  private queueUrl: string;
  private processPaymentStatusUseCase: ProcessPaymentStatusUpdatedUseCase;
  private updateOrderStatusUseCase: UpdateOrderStatusUseCase;

  constructor(
    queueUrl: string,
    processPaymentStatusUseCase: ProcessPaymentStatusUpdatedUseCase,
    updateOrderStatusUseCase: UpdateOrderStatusUseCase,
  ) {
    this.sqs = new SQSClient({
      region: process.env.AWS_REGION || 'us-west-2',
    });
    this.queueUrl = queueUrl;
    this.processPaymentStatusUseCase = processPaymentStatusUseCase;
    this.updateOrderStatusUseCase = updateOrderStatusUseCase;
  }

  async listen(): Promise<void> {
    const params = {
      QueueUrl: this.queueUrl,
      MaxNumberOfMessages: 10,
      WaitTimeSeconds: 20,
    };
    const response = await this.sqs.send(new ReceiveMessageCommand(params));
    if (response.Messages) {
      for (const message of response.Messages) {
        try {
          const { eventType, payload } = JSON.parse(message.Body || '{}');
          if (eventType === 'PAYMENT_STATUS_UPDATED') {
            await this.processPaymentStatusUseCase.execute({
              id: payload.id,
              orderId: payload.orderId,
              status: payload.status,
            });
          } else if (eventType === 'PRODUCTION_STATUS_UPDATED') {
            await this.updateOrderStatusUseCase.execute({
              id: payload.id,
              status: payload.status,
            });
          }
          await this.sqs.send(
            new DeleteMessageCommand({
              QueueUrl: this.queueUrl,
              ReceiptHandle: message.ReceiptHandle!,
            }),
          );
        } catch (err) {
          console.error('Error processing message:', err);
        }
      }
    }
  }
}
