import { GetCustomerByCpfUseCase } from '@application/use-cases/customer/GetCustomerByCpf.useCase';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';
import { Customer } from '@core/entities/customer.entity';

describe('GetCustomerByCpfUseCase Test', () => {
  const cpf = '12345678900';

  it('should return the customer if found by CPF', async () => {
    const foundCustomer = Customer.create({ cpf, name: 'João Silva', email: 'joao@email.com', id: '1' });
    const mockRepository: Partial<CustomerRepository> = {
      findByCpf: jest.fn().mockResolvedValue(foundCustomer),
    };
    const useCase = new GetCustomerByCpfUseCase(mockRepository as CustomerRepository);
    const result = await useCase.execute(cpf);
    expect(result).toBe(foundCustomer);
    expect(mockRepository.findByCpf).toHaveBeenCalledWith(cpf);
  });

  it('should return null if customer is not found', async () => {
    const mockRepository: Partial<CustomerRepository> = {
      findByCpf: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetCustomerByCpfUseCase(mockRepository as CustomerRepository);
    const result = await useCase.execute(cpf);
    expect(result).toBeNull();
    expect(mockRepository.findByCpf).toHaveBeenCalledWith(cpf);
  });
});
