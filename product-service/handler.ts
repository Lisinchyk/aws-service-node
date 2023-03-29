import getProductsList from "./src/functions/getProductsList";
import getProductsById from "./src/functions/getProductsById";
import createProduct from "./src/functions/createProduct";
import catalogBatchProcess from "@functions/catalogBatchProcess";
import dynamoDataBaseService from "./src/services";
import {
  PARAMS_PRODUCTS,
  PARAMS_STOCK
} from "./src/constants";
// import products from "./src/services/mock-data/products.json";

dynamoDataBaseService.createNewDataBase(process.env.DB_NAME_PRODUCTS, PARAMS_PRODUCTS);
dynamoDataBaseService.createNewDataBase(process.env.DB_NAME_STOCK, PARAMS_STOCK);

// products.forEach(p => clientDB.addItem(p));
// clientDB.deleteTable(process.env.DB_NAME_PRODUCTS);
// clientDB.deleteTable(process.env.DB_NAME_STOCK);

export {
  getProductsList,
  getProductsById,
  createProduct,
  catalogBatchProcess
};