import { clientDB } from "../../handler";

export class ProductServices {
  static async getAllProducts() {
    const { products, stock } = await clientDB.getAllItems();

    return products.map(prod => {
      const { count } = stock.find(({ product_id }) => product_id === prod.id);

      return {
        ...prod,
        count
      };
    });
  };

  static async getProductById(productId: string) {
    return  clientDB.getItemById(productId);
  };

  static async createProduct(newItem) {
    return await clientDB.addItem(newItem);
  };
}