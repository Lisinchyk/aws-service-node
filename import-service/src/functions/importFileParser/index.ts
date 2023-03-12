import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: `${process.env.BUCKET_NAME}`,
        event: "s3:ObjectCreated:*",
        rules: [
          { prefix: "uploaded/" }
        ],
        existing: true
      }
    }
  ]
};
