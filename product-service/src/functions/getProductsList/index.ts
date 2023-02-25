import type { ValidatedEventAPIGatewayProxyEvent } from "@libs/api-gateway";
import { formatJSONResponse } from "@libs/api-gateway";
import { ProductServices } from "../../services";
import { ERRORS_MESSAGES } from "../../constants";
import schema from "./schema";

const getProductsList: ValidatedEventAPIGatewayProxyEvent<typeof schema> = async () => {
  try {
    const products = await ProductServices.getAllProducts();

    if (!products.length) {
      return formatJSONResponse({
        message: ERRORS_MESSAGES.PRODUCTS_NOT_FOUND
      });
    }

    return formatJSONResponse({ products }, 200);

  } catch (error) {
    return formatJSONResponse({
      message: ERRORS_MESSAGES.SERVER
    });
  }
};

export default getProductsList;