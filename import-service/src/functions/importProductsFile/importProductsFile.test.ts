import AWS from 'aws-sdk-mock';
import { importProductsFile } from "@functions/importProductsFile/handler";

AWS.mock(
  'S3',
  'getSignedUrl',
  (_action, _params, callback) => { callback(null,_params.Key) }
);

const callImportProductsFileFunction = async (fileName = "") => {
  return await importProductsFile({
    queryStringParameters: {
      name: fileName
    }
  });
};

describe("importProductsFile", () => {
  test("should returns valid url and status 200", async () => {
    const expectedResultSuccess = {
      statusCode: 200,
      body: JSON.stringify({
        url: {}
      }),
    };

    const result = await callImportProductsFileFunction("mock_test_file.csv");
    expect(result).toEqual(expectedResultSuccess);
  });

  test("should return error message and status 400", async () => {
    const result = await callImportProductsFileFunction();

    const resultExpected = {
      statusCode: 400,
      body: JSON.stringify({
        message: "File name can not be empty"
      })
    };

    expect(result).toEqual(resultExpected);
  });
});