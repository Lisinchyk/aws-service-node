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

  static async publishProducts(products) {
    const sns = new SNS({region: process.env.REGION});
    const productsData = products.map(data => JSON.parse(data));
    const minPrice = Math.min(...productsData.map(p => p.price));

    console.log("publishProducts products", products);
    console.log("publishProducts productsData", productsData);
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

    const result = await sns.publish(options, (error, response) => {
      if (error) {
        console.log("publishProducts function invoked with ERROR: ", error);
        return {
          error,
          statusCode: 500
        };
        // throw new Error(error.message);
      } else {
        console.log("publishProducts func invoke SUCCESSFULLY with DATA:", response);
        return {
          response,
          statusCode: 200
        };
      }
    });

    return result;
  };
}