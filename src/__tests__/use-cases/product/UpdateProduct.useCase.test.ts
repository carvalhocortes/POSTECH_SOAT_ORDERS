import { UpdateProductUseCase } from '@application/use-cases/product/UpdateProduct.useCase';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { Product } from '@core/entities/product.entity';
import { NotFoundError } from '@shared/errors/NotFoundError';

describe('UpdateProductUseCase Test', () => {
  it('should update and save the product if found', async () => {
    const dto = { id: '1', name: 'Produto Atualizado', category: 'Cat', price: 15, description: 'desc', images: [] };
    const existingProduct = Product.create({
      id: '1',
      name: 'Produto',
      category: 'Cat',
      price: 10,
      description: 'desc',
      images: [],
    });
    const updatedProduct = Product.create({
      id: '1',
      name: 'Produto Atualizado',
      category: 'Cat',
      price: 15,
      description: 'desc',
      images: [],
    });
    const mockRepository: Partial<ProductRepository> = {
      findById: jest.fn().mockResolvedValue(existingProduct),
      update: jest.fn().mockResolvedValue(updatedProduct),
    };
    const useCase = new UpdateProductUseCase(mockRepository as ProductRepository);
    const result = await useCase.execute(dto);
    expect(result).toEqual(updatedProduct);
    expect(mockRepository.update).toHaveBeenCalledWith('1', expect.any(Product));
  });

  it('should throw NotFoundError if product does not exist', async () => {
    const dto = { id: '2', name: 'Produto', category: 'Cat', price: 10, description: 'desc', images: [] };
    const mockRepository: Partial<ProductRepository> = {
      findById: jest.fn().mockResolvedValue(null),
      update: jest.fn(),
    };
    const useCase = new UpdateProductUseCase(mockRepository as ProductRepository);
    await expect(useCase.execute(dto)).rejects.toThrow(NotFoundError);
    expect(mockRepository.update).not.toHaveBeenCalled();
  });
});
