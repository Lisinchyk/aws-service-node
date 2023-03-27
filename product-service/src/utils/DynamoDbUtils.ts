import * as dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  ScanCommand
} from "@aws-sdk/lib-dynamodb";
import {
  DynamoDBClient,
  ListTablesCommand,
  CreateTableCommand,
  DeleteTableCommand,
  waitUntilTableExists,
  waitUntilTableNotExists
} from "@aws-sdk/client-dynamodb";
import {
  MARSHALL_OPTIONS,
  UNMARSHALL_OPTIONS
} from "../constants";

dotenv.config();

export class DynamoDataBaseUtils {
  _dynamoClient = this.initClient();
  _dynamoDocClient = this.initDocClient();
  _productsDB = process.env.DB_NAME_PRODUCTS;
  _stockDB = process.env.DB_NAME_STOCK;

  initClient() {
    return new DynamoDBClient({ region: process.env.REGION});
  }

  initDocClient() {
    return DynamoDBDocumentClient.from(this._dynamoClient, {
      marshallOptions: MARSHALL_OPTIONS,
      unmarshallOptions: UNMARSHALL_OPTIONS
    });
  }

  async checkIfTablesExist(tableName) {
    try {
      const { TableNames } = await this._dynamoClient.send(new ListTablesCommand({}));
      return TableNames.includes(tableName);
    } catch (error) {
      console.log("Error DB connection", error.message);
    }
  }

  async createNewDataBase(tableName, tableParams) {
    const isTable = await this.checkIfTablesExist(tableName);

    if (isTable) {
      return;
    }

    try {
      await this._dynamoClient.send(new CreateTableCommand(tableParams));
      await waitUntilTableExists(
        { client: this._dynamoClient, maxWaitTime: 15, maxDelay: 2, minDelay: 1 },
        { TableName: tableName }
      );
    } catch (error) {
      console.log("createNewDataBase error", error.message);
    }
  }

  async addItem(item) {
    const itemId = uuidv4();
    const productData = new PutCommand({
      TableName: this._productsDB,
      Item: {
        id: itemId,
        title: item.title,
        price: item.price,
        description: item.description,
      },
    });
    const stockData = new PutCommand({
      TableName: this._stockDB,
      Item: {
        product_id: itemId,
        count: item.count,
      },
    });

    try {
      await Promise.all([
        this._dynamoDocClient.send(productData),
        this._dynamoDocClient.send(stockData)
      ]);

      return {
        status: 200,
        message: "New product is created and added"
      };
    } catch (error) {
      console.log("addItem error:", error.message);
      return error.message;
    }
  }

  async getItemById(productId) {
    try {
      const [product, stock] = await Promise.all([
        this._dynamoDocClient.send(new GetCommand({
          TableName: this._productsDB,
          Key: { "id": productId }
        })),
        this._dynamoDocClient.send(new GetCommand({
          TableName: this._stockDB,
          Key: { "product_id": productId }
        }))
      ]);

      return {
        ...product.Item,
        count: stock.Item.count
      };
    } catch (error) {
      console.log("getItemById error", error);
    }
  }

  async getAllItems() {
    try {
      const [products, stock] = await Promise.all([
        this._dynamoDocClient.send(new ScanCommand({ TableName: this._productsDB })),
        this._dynamoDocClient.send(new ScanCommand({ TableName: this._stockDB })),
      ]);

      return {
        products: products.Items,
        stock: stock.Items
      };
    } catch (error) {
      console.log("getAllItems error", error.message);
    }
  }

  async deleteTable(tableName) {
    const isExists = await this.checkIfTablesExist(tableName);

    if (!isExists) {
      return;
    }

    try {
      await this._dynamoClient.send(new DeleteTableCommand({TableName: tableName}));

      await waitUntilTableNotExists(
        {
          client: this._dynamoClient,
          maxWaitTime: 10,
          maxDelay: 2,
          minDelay: 1
        },
        {
          TableName: tableName
        }
      );
    } catch (error) {
      console.log("deleteTable error", error.message);
    }
  }
}