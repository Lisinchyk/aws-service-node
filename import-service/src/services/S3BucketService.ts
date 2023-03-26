import AWS from "aws-sdk";
import csv from "csv-parser";
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

  static async createReadStream (s3Object) {
    const sqs = new AWS.SQS();
    const products = [];
    const result = await s3Object
      .createReadStream()
      .pipe(csv(["title", "price", "description", "count"]))
      .on("data", async (product) => {
        try {
          await this.sendMessageToSQS(sqs, product);
          products.push(product);
          console.log("Message has been sent to SQS", product);
        } catch (error) {
          console.log("Error during sendMessageToSQS", error.message);
        }
        return products;
      })
      .on("error", (error) => {
        console.log("createReadStream ERROR", error.message);
      })
      .on("end", async (products) => {
        console.log("createReadStream END", products);
        return products;
      });

    console.log("RESULT", result);
    return result;
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

  static async sendMessageToSQS (sqs, messageBody) {
    await sqs.sendMessage(
      {
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(messageBody),
      },
      (error, data) => {
        if (error) {
          console.log('SQS error', error);
          throw Error(error);
        }
        console.log(`Send message:`, data);
      },
    );
  };
}