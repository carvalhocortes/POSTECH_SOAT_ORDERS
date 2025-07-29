import { ListProductsUseCase } from '@application/use-cases/product/ListProducts.useCase';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { Product } from '@core/entities/product.entity';

describe('ListProductsUseCase Test', () => {
  it('should return a list of products', async () => {
    const products = [
      Product.create({ id: '1', name: 'Produto 1', category: 'Cat', price: 10, description: 'desc', images: [] }),
      Product.create({ id: '2', name: 'Produto 2', category: 'Cat', price: 20, description: 'desc', images: [] }),
    ];
    const mockRepository: Partial<ProductRepository> = {
      findAll: jest.fn().mockResolvedValue(products),
    };
    const useCase = new ListProductsUseCase(mockRepository as ProductRepository);
    const result = await useCase.execute();
    expect(result).toEqual(products);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });

  it('should return an empty list if no products exist', async () => {
    const mockRepository: Partial<ProductRepository> = {
      findAll: jest.fn().mockResolvedValue([]),
    };
    const useCase = new ListProductsUseCase(mockRepository as ProductRepository);
    const result = await useCase.execute();
    expect(result).toEqual([]);
    expect(mockRepository.findAll).toHaveBeenCalled();
  });
});
