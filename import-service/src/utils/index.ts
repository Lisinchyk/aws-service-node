import AWS from "aws-sdk";
import csv from "csv-parser";

const sendMessageToSQS = (sqs, messageBody) => {
  const params = {
    QueueUrl: process.env.SQS_URL,
    MessageBody: JSON.stringify(messageBody),
  };

  const callback = (error, data) => {
    if (error) {
      console.log("sendMessageToSQS message error", error, messageBody);
      throw new Error(error.message);
    } else {
      console.log("Message has been sent to SQS with result", messageBody, data);
    }
  };

  sqs.sendMessage(params, callback);
};

export const createReadStream = (s3Object) => {
  const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

  return new Promise(() => {
    const products = [];
    s3Object.createReadStream()
      .pipe(csv())
      .on("data", (product) => {
        sendMessageToSQS(sqs, product);
        products.push(product)
      })
      .on("end", () => console.log("createReadStream END", products));

    return products;
  });
};