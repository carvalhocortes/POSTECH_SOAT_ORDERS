import { Request, Response } from 'express';

import { ProcessPaymentStatusUpdatedUseCase } from '@application/use-cases/payment/ProcessPaymentStatusUpdated.useCase';
import { ProcessPaymentStatusUpdatedDTO } from '@application/dto/payment/ProcessPaymentStatusUpdated.dto';

export class PaymentWebhookController {
  constructor(private readonly updatePaymentUseCase: ProcessPaymentStatusUpdatedUseCase) {}

  handlePaymentNotification = async (req: Request, res: Response): Promise<void> => {
    const dto = ProcessPaymentStatusUpdatedDTO.create(req);
    const customer = await this.updatePaymentUseCase.execute(dto);
    res.json(customer);
  };
}
