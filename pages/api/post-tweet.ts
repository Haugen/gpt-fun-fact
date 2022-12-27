import { verifySignature } from "@upstash/qstash/nextjs";
import type { NextApiRequest, NextApiResponse } from "next";
import Twit from "twit";

import prisma from "../../lib/prisma";

type SuccessResponse = {
  result: string;
};
type ErrorResponse = {
  error: {
    message: string;
  };
};
type Response = SuccessResponse | ErrorResponse;

async function handler(req: NextApiRequest, res: NextApiResponse<Response>) {
  try {
    const T = new Twit({
      consumer_key: process.env.TWITTER_API_KEY as string,
      consumer_secret: process.env.TWITTER_API_KEY_SECRET as string,
      access_token: process.env.TWITTER_ACCESS_TOKEN,
      access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET,
    });
    const fact = await prisma.fact.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!fact) throw new Error("No fact found in db");

    T.post("statuses/update", { status: fact.text }, (err, reply) => {
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

export default verifySignature(handler, {
  currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY,
  nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY,
});

export const config = {
  api: {
    bodyParser: false,
  },
};
