import products from "./mock-data/products.json";

export class ProductServices {
  static getAllProducts() {
    return Promise.resolve(products);
  }

  static getProductById(productId: string) {
    return Promise.resolve(
      products.find( product => product.id === productId )
    );
  }
}