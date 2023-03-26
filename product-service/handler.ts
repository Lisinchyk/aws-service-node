import getProductsList from "./src/functions/getProductsList";
import getProductsById from "./src/functions/getProductsById";
import createProduct from "./src/functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";
import { DynamoDataBaseUtils } from "./src/utils";
import {
  PARAMS_PRODUCTS,
  PARAMS_STOCK
} from "./src/constants";
// import products from "./src/services/mock-data/products.json";

export const clientDB = new DynamoDataBaseUtils();

clientDB.createNewDataBase(process.env.DB_NAME_PRODUCTS, PARAMS_PRODUCTS);
clientDB.createNewDataBase(process.env.DB_NAME_STOCK, PARAMS_STOCK);

// products.forEach(p => clientDB.addItem(p));
// clientDB.deleteTable(process.env.DB_NAME_PRODUCTS);
// clientDB.deleteTable(process.env.DB_NAME_STOCK);

export {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess
};