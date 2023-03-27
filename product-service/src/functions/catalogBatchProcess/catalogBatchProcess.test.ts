import catalogBatchProcess from "@functions/catalogBatchProcess/index";
import { ProductServices } from "../../services";
import { HEADERS } from "../../constants";
import dynamoDataBaseService from "../../services/index";
import clearAllMocks = jest.clearAllMocks;

jest.mock("../../services");

const mockDataValid = {
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
const mockDataNotValid = {
  "Records": [
    {
      "body": "{\"title4234\":\"CSV-File4\",\"price\":\"10\",\"description\":\"Some description CSV-File4\",\"count\":\"12\"}"
    }
  ]
};

const mockDB = () => {
  dynamoDataBaseService.initClient = jest.fn();
  dynamoDataBaseService.initDocClient = jest.fn();
  dynamoDataBaseService.createNewDataBase = jest.fn();
  dynamoDataBaseService.createNewDataBase = jest.fn();
  dynamoDataBaseService.addItem = jest.fn().mockResolvedValue({
    status: 200,
    message: "New product is created and added"
  });
}

describe("catalogBatchProcess", () => {
  beforeEach(() => {
    clearAllMocks();
    mockDB();
  })

  test("should return status 200", async () => {
    ProductServices.createProduct = jest.fn().mockResolvedValue({});
    ProductServices.publishProducts = jest.fn().mockResolvedValue({});

    const result = await catalogBatchProcess(mockDataValid);

    expect(result).toEqual({
      headers: HEADERS,
      statusCode: 200,
      body: JSON.stringify({message: "catalogBatchProcess: Products have been created and published"})
    });
  });

  test("should return status 400 and appropriate error message WHEN no products to create", async () => {
    const result = await catalogBatchProcess(mockDataNotValid);

    expect(result).toEqual({
      headers: HEADERS,
      statusCode: 400,
      body: JSON.stringify({message: "Products not found..."})
    });
  });

  test("should return status 500 and appropriate error message WHEN product was not created", async () => {
    ProductServices.createProduct = jest.fn().mockRejectedValue({message: "error message"});
    const result = await catalogBatchProcess(mockDataValid);

    expect(result).toEqual({
      headers: HEADERS,
      statusCode: 500,
      body: JSON.stringify({message: "error message"})
    });
  });

  test("should return status 500 and appropriate error message WHEN publishProducts finished with error", async () => {
    ProductServices.createProduct = jest.fn().mockResolvedValue({});
    ProductServices.publishProducts = jest.fn().mockRejectedValue({message: "error message"});
    const result = await catalogBatchProcess(mockDataValid);

    expect(result).toEqual({
      headers: HEADERS,
      statusCode: 500,
      body: JSON.stringify({message: "error message"})
    });
  });
});