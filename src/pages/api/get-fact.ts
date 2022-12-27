import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import dayjs from "dayjs";
import { verifySignature } from "@upstash/qstash/nextjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import prisma from "../../lib/prisma";

dayjs.extend(advancedFormat);

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

type SuccessResponse = {
  result: string;
};
type ErrorResponse = {
  error: {
    message: string;
  };
};
type Response = SuccessResponse | ErrorResponse;

async function handler(_: NextApiRequest, res: NextApiResponse<Response>) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  try {
    const now = new Date();
    const date = dayjs(now).format("MMMM Do");

    const completion = await openai.createCompletion({
      max_tokens: 80,
      model: "text-davinci-003",
      prompt: `Make up a fun and unexpected historical fact that could have happened on ${date}. It could be about some event, accidents, sports, entertainment, local events, science, discoveries, nature, philosophy, the universe or something completely random. Just make it fun. It's suppose to make people smile. The year of the fact should be somewhere between 1200 and 2021. Start the text with "On ${date}", followed by the year and then the fact. Make sure that the fact is not true. Make your response short, less than 250 letters.`,
      temperature: 1,
    });
    await prisma.fact.create({
      data: {
        text: completion.data?.choices[0]?.text?.substring(2) as string,
      },
    });
    res.status(200).json({ result: "Successfully added fact to db" });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res
        .status(500)
        .json({ error: { message: "An error occurred during your request." } });
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
