import LambdaTester from "lambda-tester";
import { ProductServices } from "../../services";
import getProductsById from "@functions/getProductsById/index";

jest.mock("../../services");

const product = { id: "3", title: "title" };

describe("getProductsById", () => {
  test("should return type of function", () => {
    expect(typeof getProductsById).toBe("function");
  });

  test( "should return a product and have status 200", async () => {
    await (ProductServices.getProductById as jest.Mock).mockResolvedValueOnce(product);
    await LambdaTester(getProductsById)
      .event({pathParameters: { productId: "3" }})
      .expectResult((result) => {
        expect(result.statusCode).toBe(200);
        expect(result.body).toBe(JSON.stringify({ product }));
      }
    );
  });

  test( "should return error WHEN product was not find", async () => {
    await (ProductServices.getProductById as jest.Mock).mockResolvedValueOnce(undefined);
    await LambdaTester(getProductsById)
      .event({pathParameters: { productId: "3" }})
      .expectResult((result) => {
          expect(result.statusCode).toBe(500);
          expect(result.body).toBe(JSON.stringify({ message: "Product not found" }));
        }
      );
  });

  test( "should return error", async () => {
    await (ProductServices.getProductById as jest.Mock).mockRejectedValue({});
    await LambdaTester(getProductsById)
      .event({pathParameters: { productId: "3" }})
      .expectResult((result) => {
          expect(result.statusCode).toBe(500);
          expect(result.body).toBe(JSON.stringify({ message: "Internal server error" }));
        }
      );
  });
});