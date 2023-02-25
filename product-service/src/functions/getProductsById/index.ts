import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { ProductServices } from "../../services";
import { ERRORS_MESSAGES } from "../../constants";
import schema from "./schema";

const getProductsById: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async (event) => {
  try {
    const { productId } = event.pathParameters;
    const product = await ProductServices.getProductById(productId);

    if (!product) {
      return formatJSONResponse({
        message: ERRORS_MESSAGES.PRODUCT_NOT_FOUND
      });
    }

    return formatJSONResponse(product, 200);

  } catch (error) {
    return formatJSONResponse({
      message: ERRORS_MESSAGES.SERVER
    });
  }
};

export default getProductsById;