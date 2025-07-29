import { DeleteProductUseCase } from '@application/use-cases/product/DeleteProduct.useCase';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';

describe('DeleteProductUseCase Test', () => {
  it('should call repository delete with correct id', async () => {
    const mockRepository: Partial<ProductRepository> = {
      delete: jest.fn().mockResolvedValue(undefined),
    };
    const useCase = new DeleteProductUseCase(mockRepository as ProductRepository);
    await useCase.execute('1');
    expect(mockRepository.delete).toHaveBeenCalledWith('1');
  });
});
