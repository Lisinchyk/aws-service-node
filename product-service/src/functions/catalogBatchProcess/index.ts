import { formatJSONResponse } from "@libs/api-gateway";
import { ProductServices } from "../../services";
import { productValidation } from "../../utils";
import schema from "./schema";


const catalogBatchProcess = async (event) => {
  console.log("catalogBatchProcess was called with", JSON.stringify(event));

  try {
    const records = event.Records.map(({ body }) => JSON.parse(body));

    console.log("catalogBatchProcess records", records);

    const products = records.reduce((products, record) => {
      const validationResult = productValidation(record, schema);

      if (validationResult) {
        console.log(`Validation error with a message "${validationResult.message}" - product:`, record);
      } else {
        products.push(record);
      }

      return products;
    }, []);

    console.log("catalogBatchProcess products", products);

    if(!products.length) {
      return formatJSONResponse({
        message: "Products not found..."
      }, 400);
    }

    for await (const product of products) {
      await ProductServices.createProduct(product);
    }

    const publishResult = await ProductServices.publishProducts(products);

    console.log("catalogBatchProcess publishResult", publishResult);

    return formatJSONResponse({
      message: `catalogBatchProcess: Products have been created and published`,
    }, 200);
  } catch (error) {
    console.log("catalogBatchProcess finished  with error:", error.message);
    return formatJSONResponse({ message: error.message });
  }
};

export default catalogBatchProcess;