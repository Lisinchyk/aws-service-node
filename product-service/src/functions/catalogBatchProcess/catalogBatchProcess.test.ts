import AWS from "aws-sdk-mock";
import catalogBatchProcess from "@functions/catalogBatchProcess/index";
import { ProductServices } from "../../services";
import {HEADERS} from "../../constants";

jest.mock("../../services", () => ({
  ...jest.requireActual("../../services"),
  createProduct: jest.fn(),
  publishProducts: jest.fn()
}));

jest.mock("../../utils", () => {
  return {
    DynamoDataBaseUtils: jest.fn().mockImplementation(() => {
      return {
        initClient: jest.fn(),
        initDocClient: jest.fn(),
        createNewDataBase: jest.fn(),
        addItem: jest.fn().mockReturnValue({
          status: 200,
          message: "New product is created and added"
        })
      };

    }),
    productValidation: jest.fn()
  };
});

AWS.mock("SNS", "publish", Promise.resolve());

const mockData = {
  "Records": [
    {
      "body": "{\"title\":\"CSV-File4\",\"price\":\"10\",\"description\":\"Some description CSV-File4\",\"count\":\"12\"}"
    },
    {
      "body": "{\"title\":\"CSV-File5\",\"price\":\"3\",\"description\":\"Some description CSV-File5\",\"count\":\"52\"}"
    },
    {
      "body": "{\"title\":\"CSV-File6\",\"price\":\"22\",\"description\":\"Some description CSV-File6\",\"count\":\"43\"}"
    }
  ]
};

describe("catalogBatchProcess", () => {
  jest.spyOn(ProductServices, "createProduct").mockResolvedValue("data");

  test("should return status 200", async () => {
    const result = await catalogBatchProcess(mockData);

    expect(result).toEqual({
      headers: HEADERS,
      statusCode: 200,
      body: {}
    });
  });
});