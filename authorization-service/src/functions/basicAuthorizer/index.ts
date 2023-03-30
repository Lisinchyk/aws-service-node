import { APIGatewayAuthorizerEvent } from "aws-lambda";
import { formatJSONResponse } from "@libs/api-gateway";
import { generatePolicy } from "../../utils";
import {
  EFFECT,
  ENCODING_TYPE
} from "../../constants";

export const basicAuthorizer = async (event: APIGatewayAuthorizerEvent) => {
  console.log("Function basicAuthorizer invoked:", JSON.stringify(event));

  try {
    // @ts-ignore
    const { type, authorizationToken, methodArn } = event;

    if (type !== "TOKEN") {
      return "Unauthorized from lambda basicAuthorizer";
    }

    const credentials = authorizationToken.split(" ")[1];
    const encoded = Buffer.from(credentials, "base64");
    const [userName, password] = encoded.toString(ENCODING_TYPE).split(":");

    console.log(`userName: ${userName} / pass: ${password}`);

    const response = !process.env[userName] ||
      process.env[userName] !== password
        ? generatePolicy(credentials, EFFECT.DENY, methodArn)
        : generatePolicy(credentials, EFFECT.ALLOW, methodArn);

    console.log("policy response:", response);

    return response;
  } catch (error) {
    return formatJSONResponse({ message: error.message });
  }
};