import express from "express";
import axios from "axios";
import * as dotenv from "dotenv";
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

const getAxiosConfig = (res, originalUrl, method, body) => {
  const [, recipient] = originalUrl.split("/");
  console.log("recipient", recipient);

  const recipientUrl = process.env[recipient.toUpperCase()];
  console.log("recipientUrl", recipientUrl);

  if (!recipientUrl) {
    res.status(502).json({error: "Cannot process request"});
    return null;
  }

  const isBody = !!Object.keys(body)?.length;

  return {
    method,
    url: `${recipientUrl}${originalUrl}`,
    ...(isBody && body)
  };
};

const apiRedirect = async (axiosConfig, res) => {
  try {
    const { data } = await axios(axiosConfig);

    console.log("response recipient", data);

    res.json(data);
  } catch (error) {
    console.log("error", error);

    const { status, data } = error?.response;

    if (status) {
      res.status(status).json(data);
    } else {
      res.status(500).json({error: error.message});
    }
  }
}

app.all("/*", (req, res) => {
  const { originalUrl, method, body } = req;
  console.log("req", originalUrl, method, body);

  const axiosConfig = getAxiosConfig(res, originalUrl, method, body);

  console.log("axiosConfig", axiosConfig);

  axiosConfig && apiRedirect(axiosConfig, res);
});

app.listen(PORT, () => {
  console.log(`App is running on the http://localhost:${PORT}`);
});