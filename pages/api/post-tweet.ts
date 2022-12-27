import type { NextApiRequest, NextApiResponse } from "next";
import Twit from "twit";

type SuccessResponse = {
  result: string;
};
type ErrorResponse = {
  error: {
    message: string;
  };
};
type Response = SuccessResponse | ErrorResponse;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  try {
    const T = new Twit({
      consumer_key: process.env.TWITTER_API_KEY as string,
      consumer_secret: process.env.TWITTER_API_KEY_SECRET as string,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });

    T.post("statuses/update", { status: "test" }, (err, reply) => {
      if (err) {
        console.log("Error: ", err.message);
      } else {
        console.log("Success: ", reply);
      }
    });

    res.status(200).json({ result: "Twit twit" });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with Twitter API: ${error.message}`);
      res.status(500).json({ error: { message: "Unable to post tweet." } });
    }
  }
}
