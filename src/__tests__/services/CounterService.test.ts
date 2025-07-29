import { CounterService } from '@application/services/CounterService';
import { CounterRepository } from '@interfaces/gateways/CounterRepository.gateway';

describe('CounterService Test', () => {
  it('should return the next sequence number for the counter', async () => {
    const mockRepository: Partial<CounterRepository> = {
      getNextSequenceNumber: jest.fn().mockResolvedValue({ seq: 5 }),
    };
    const service = new CounterService(mockRepository as CounterRepository);
    const result = await service.getNextSequenceNumber('order');
    expect(result).toBe(5);
  });

  it('should return 1 if the counter does not exist', async () => {
    const mockRepository: Partial<CounterRepository> = {
      getNextSequenceNumber: jest.fn().mockResolvedValue(undefined),
    };
    const service = new CounterService(mockRepository as CounterRepository);
    const result = await service.getNextSequenceNumber('order');
    expect(result).toBe(1);
  });
});
