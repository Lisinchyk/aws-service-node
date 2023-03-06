export const HEADERS = {
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
};

export const ERRORS_MESSAGES = {
  PRODUCTS_NOT_FOUND: "Products not found",
  PRODUCT_NOT_FOUND: "Product not found",
  SERVER: "Internal server error"
};

export const PARAMS_PRODUCTS = {
  AttributeDefinitions: [
    {
      AttributeName: "id",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "id",
      KeyType: "HASH",
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: process.env.DB_NAME_PRODUCTS,
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export const PARAMS_STOCK = {
  AttributeDefinitions: [
    {
      AttributeName: "product_id",
      AttributeType: "S"
    }
  ],
  KeySchema: [
    {
      AttributeName: "product_id",
      KeyType: "HASH",
    }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 1,
    WriteCapacityUnits: 1,
  },
  TableName: process.env.DB_NAME_STOCK,
  StreamSpecification: {
    StreamEnabled: false,
  },
};

export const MARSHALL_OPTIONS = {
  convertEmptyValues: true,
  removeUndefinedValues: true,
  convertClassInstanceToMap: false
};

export const UNMARSHALL_OPTIONS = {
  wrapNumbers: false
};