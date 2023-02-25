import LambdaTester from "lambda-tester";
import getProductList from "@functions/getProductsList";
import { ProductServices } from "../../services";

jest.mock("../../services");

const products = [{id: "2", title: "title"}];

describe("getProductList", () => {
  test("should return type of function", () => {
    expect(typeof getProductList).toBe("function");
  });

  test( "should return list of products and have status 200", async () => {
    await (ProductServices.getAllProducts as jest.Mock).mockResolvedValueOnce(products);
    await LambdaTester(getProductList).expectResult(
      (result) => {
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({ data: products }));
      }
    );
  });

  test( "should return error and have status 500", async () => {
    await (ProductServices.getAllProducts as jest.Mock).mockResolvedValueOnce([]);
    await LambdaTester(getProductList).expectResult(
      (result) => {
        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({message: "Products not found"}));
      }
    );
  });

  test( "should return internal server error", async () => {
    await (ProductServices.getAllProducts as jest.Mock).mockRejectedValue({});
    await LambdaTester(getProductList).expectResult(
      (result) => {
        expect(result.statusCode).toBe(500);
        expect(result.body).toBe(JSON.stringify({message: "Internal server error"}));
      }
    );
  });
});