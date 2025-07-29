import { PaymentStatus } from '@core/entities/order.entity';

export class ProcessPaymentStatusUpdatedDTO {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly status: PaymentStatus,
  ) {}

  static create(data: { payload: { id: string; orderId: string; status: PaymentStatus } }): ProcessPaymentStatusUpdatedDTO {
    if (!data.payload.orderId) {
      throw new Error('Order ID is required');
    }

    return new ProcessPaymentStatusUpdatedDTO(data.payload.id, data.payload.orderId, data.payload.status);
  }
}
