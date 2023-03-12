import { formatJSONResponse } from '@libs/api-gateway';
import { S3BucketService } from "../../services/S3BucketService";
import { S3_FOLDER } from "../../constants";

export const importProductsFile = async (event) => {
  try {
    console.log("Function called with event:", event);

    const name = event.queryStringParameters.name;

    if (!name) {
      return formatJSONResponse({
        message: "File name can not be empty"
      }, 400);
    }

    const url = await S3BucketService.getFileUrl({
      Bucket: process.env.BUCKET_NAME,
      Key: `${S3_FOLDER.UPLOADED}/${name}`,
      Expires: 60,
      ContentType: "text/csv",
    });

    if (!url) {
      return formatJSONResponse({
        message: "Can not get URL",
      }, 500);
    }

    console.log("Success, URL:", url);

    return formatJSONResponse({ url }, 200);
  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
};