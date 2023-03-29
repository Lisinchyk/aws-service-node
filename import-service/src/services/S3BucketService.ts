import AWS from "aws-sdk";
import { S3_FOLDER } from "../constants";

export class S3BucketService {
  static init() {
    return new AWS.S3({ region: process.env.REGION });
  };

  static async getFileUrl(params) {
    const s3 = this.init();
    return s3.getSignedUrl("putObject", params);
  }

  static async getObject({s3, bucketName, objectKey}) {
    try {
      return await s3.getObject({
        Bucket: bucketName,
        Key: objectKey
      });
    } catch (error) {
      console.log("Error during get s3 Object", error);
      return error.message;
    }
  };

  static async copyObject ({ s3, bucketName, objectKey }) {
    console.log("copyObject", s3, bucketName, objectKey);
    try {
      await s3
        .copyObject({
          Bucket: bucketName,
          CopySource: `${bucketName}/${objectKey}`,
          Key: objectKey.replace(S3_FOLDER.UPLOADED, S3_FOLDER.PARSED),
        })
        .promise();
    } catch (error) {
      return error.message;
    }
  };

  static async deleteObject ({ s3, bucketName, objectKey }) {
    try {
      await s3
        .deleteObject({
          Bucket: bucketName,
          Key: objectKey
        })
        .promise();
    } catch (error) {
      return error.message;
    }
  };
}