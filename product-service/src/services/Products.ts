import { SNS } from "aws-sdk";
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

  static publishProducts(products) {
    return new Promise(() => {
      const sns = new SNS({ region: process.env.REGION });
      const minPrice = Math.min(...products.map(p => p.price));

      console.log("publishProducts products", products);
      console.log("publishProducts minPrice", minPrice);

      const options = {
        Subject: "New products has been created",
        MessageAttributes: {
          price: {
            DataType: "Number",
            StringValue: `${minPrice}`
          }
        },
        Message: JSON.stringify(products),
        TopicArn: process.env.CREATE_PRODUCT_TOPIC_ARN
      }

      console.log("publishProducts options", options);

      sns.publish(options, (error, response) => {
        if (error) {
          console.log("publishProducts function invoked with ERROR: ", error);
          throw new Error(error.message);
        } else {
          console.log("publishProducts func invoke SUCCESSFULLY with DATA:", response);
        }
      });
    });
  };
}