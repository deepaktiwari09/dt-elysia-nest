import { Elysia } from 'elysia';

const productService = new Elysia();

productService.decorate('getProduct', () => {
  return ['Product1', 'Product2', 'Product3'];
});

productService.decorate('getProductById', (id) => {
  return { id, name: `Product${id}` };
});

productService.decorate('updateProductById', (id) => {
    return { id, name: `Product${id}` };
});

productService.decorate('deleteProductById', (id) => {
    return { id, name: `Product${id}` };
});

productService.decorate('createProduct', (id) => {
    return { id, name: `Product${id}` };
});

export default productService;