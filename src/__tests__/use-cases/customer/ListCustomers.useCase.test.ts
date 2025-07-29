import { ListCustomersUseCase } from '@application/use-cases/customer/ListCustomers.useCase';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';
import { Customer } from '@core/entities/customer.entity';

describe('ListCustomersUseCase Test', () => {
  it('should return a list of customers', async () => {
    const customers = [
      Customer.create({ cpf: '12345678900', name: 'João Silva', email: 'joao@email.com', id: '1' }),
      Customer.create({ cpf: '98765432100', name: 'Maria Souza', email: 'maria@email.com', id: '2' }),
    ];
    const mockRepository: Partial<CustomerRepository> = {
      findAll: jest.fn().mockResolvedValue(customers),
    };
    const useCase = new ListCustomersUseCase(mockRepository as CustomerRepository);
    const result = await useCase.execute();
    expect(result).toEqual(customers);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty list if no customers exist', async () => {
    const mockRepository: Partial<CustomerRepository> = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const useCase = new ListCustomersUseCase(mockRepository as CustomerRepository);
    const result = await useCase.execute();
    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
