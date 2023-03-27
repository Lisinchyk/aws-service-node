import { formatJSONResponse } from "@libs/api-gateway";
import { S3BucketService } from "../../services/S3BucketService";
import { createReadStream } from "../../utils";
import { S3_FOLDER } from "../../constants";

export const importFileParser = async (event) => {
  console.log("Function importFileParser was called with event:", JSON.stringify(event));
  try {
    const s3 = S3BucketService.init();
    const records = event.Records;

    for (const record of records) {
      const params = {
        s3,
        bucketName: record.s3.bucket.name,
        objectKey: record.s3.object.key
      };

      const object = await S3BucketService.getObject(params);
      await createReadStream(object);
      await S3BucketService.copyObject(params);
      await S3BucketService.deleteObject(params);
    }

    return formatJSONResponse({
      success: `S3 Objects was successfully moved to the folder ${S3_FOLDER.PARSED}`
    }, 200);

  } catch (error) {
    return formatJSONResponse({
      message: error.message
    }, 500);
  }
};