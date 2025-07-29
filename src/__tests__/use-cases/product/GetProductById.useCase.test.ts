import { GetProductByIdUseCase } from '@application/use-cases/product/GetProductById.useCase';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { Product } from '@core/entities/product.entity';

describe('GetProductByIdUseCase Test', () => {
  it('should return the product if found by id', async () => {
    const product = Product.create({
      id: '1',
      name: 'Produto',
      category: 'Cat',
      price: 10,
      description: 'desc',
      images: [],
    });
    const mockRepository: Partial<ProductRepository> = {
      findById: jest.fn().mockResolvedValue(product),
    };
    const useCase = new GetProductByIdUseCase(mockRepository as ProductRepository);
    const result = await useCase.execute('1');
    expect(result).toBe(product);
    expect(mockRepository.findById).toHaveBeenCalledWith('1');
  });

  it('should return null if product is not found', async () => {
    const mockRepository: Partial<ProductRepository> = {
      findById: jest.fn().mockResolvedValue(null),
    };
    const useCase = new GetProductByIdUseCase(mockRepository as ProductRepository);
    const result = await useCase.execute('2');
    expect(result).toBeNull();
    expect(mockRepository.findById).toHaveBeenCalledWith('2');
  });
});
