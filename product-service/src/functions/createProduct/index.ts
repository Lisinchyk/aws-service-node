import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { ProductServices } from "../../services";
import { ERRORS_MESSAGES } from "../../constants";
import { productValidation } from "../../utils";
import schema from "./schema";

const createProduct: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    // @ts-ignore
    const newProductData = JSON.parse(event.body);
    console.log("newProductData", newProductData);

    const validationResult = productValidation(newProductData, schema);

    if (validationResult) {
      return formatJSONResponse({
        message: validationResult.message
      }, 400);
    }

    const { message, status } = await ProductServices.createProduct(newProductData);

    return formatJSONResponse(message, status);

  } catch (error) {
    return formatJSONResponse({
      message: ERRORS_MESSAGES.SERVER
    });
  }
};

export default createProduct;