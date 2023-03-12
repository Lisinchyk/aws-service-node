import type { AWS } from "@serverless/typescript";

import {
  importProductsFile,
  importFileParser
} from "./src/functions/index";

const serverlessConfiguration: AWS = {
  service: "import-service",
  frameworkVersion: "3",
  useDotenv: true,
  plugins: ["serverless-webpack"],
  provider: {
    name: "aws",
    runtime: "nodejs16.x",
    region: "us-east-1",
    stage: "dev",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["s3:ListBucket"],
        Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}`
      },
      {
        Effect: "Allow",
        Action: ["s3:*"],
        Resource: `arn:aws:s3:::${process.env.BUCKET_NAME}/*`
      }
    ]
  },
  // import the function via paths
  // @ts-ignore
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    webpack: {
      webpackConfig: "webpack.config.js",
      includeModules: true
    }
  },
};

module.exports = serverlessConfiguration;