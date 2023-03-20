import { handlerPath } from "@libs/handler-resolver";

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: "get",
        path: "import",
        request: {
          parameters: {
            queryStrings: {
              name: true
            }
          }
        },
        cors: true
      }
    }
  ]
};