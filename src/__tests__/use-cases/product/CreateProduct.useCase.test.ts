import { CreateProductUseCase } from '@application/use-cases/product/CreateProduct.useCase';
import { ProductRepository } from '@interfaces/gateways/ProductRepository.gateway';
import { CreateProductDTO } from '@application/dto/product/CreateProduct.dto';
import { Product } from '@core/entities/product.entity';

describe('CreateProductUseCase Test', () => {
  it('should create and save a new product', async () => {
    const dto = new CreateProductDTO('1', 'Produto Teste', 'Categoria Teste', 99.99, 'Descrição do produto', [
      'img1.png',
      'img2.png',
    ]);
    const createdProduct = Product.create({
      id: dto.id,
      name: dto.name,
      category: dto.category,
      price: dto.price,
      description: dto.description,
      images: dto.images,
    });
    const mockRepository: Partial<ProductRepository> = {
      save: jest.fn().mockResolvedValue(createdProduct),
    };
    const useCase = new CreateProductUseCase(mockRepository as ProductRepository);
    const result = await useCase.execute(dto);
    expect(result).toEqual(createdProduct);
    expect(mockRepository.save).toHaveBeenCalledWith(expect.objectContaining({ name: dto.name }));
  });
});
