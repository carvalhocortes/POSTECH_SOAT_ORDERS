import { CreateCustomerUseCase } from '@application/use-cases/customer/CreateCustomer.useCase';
import { CustomerRepository } from '@interfaces/gateways/CustomerRepository.gateway';
import { CreateCustomerDTO } from '@application/dto/customer/CreateCustomer.dto';
import { Customer } from '@core/entities/customer.entity';

describe('CreateCustomerUseCase Test', () => {
  const dto = new CreateCustomerDTO('12345678900', 'João Silva', 'joao@email.com');

  it('should return the existing customer if already registered', async () => {
    const existingCustomer = Customer.create({ cpf: dto.cpf, name: dto.name, email: dto.email, id: '1' });
    const mockRepository: Partial<CustomerRepository> = {
      findByCpf: jest.fn().mockResolvedValue(existingCustomer),
      save: jest.fn(),
    };
    const useCase = new CreateCustomerUseCase(mockRepository as CustomerRepository);
    const result = await useCase.execute(dto);
    expect(result).toBe(existingCustomer);
    expect(mockRepository.save).not.toHaveBeenCalled();
  });

  it('should create and save a new customer if not existing', async () => {
    const createdCustomer = Customer.create({ cpf: dto.cpf, name: dto.name, email: dto.email });
    const mockRepository: Partial<CustomerRepository> = {
      findByCpf: jest.fn().mockResolvedValue(null),
      save: jest.fn().mockResolvedValue(createdCustomer),
    };
    const useCase = new CreateCustomerUseCase(mockRepository as CustomerRepository);
    const result = await useCase.execute(dto);
    expect(result).toEqual(createdCustomer);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ cpf: dto.cpf }));
  });
});
