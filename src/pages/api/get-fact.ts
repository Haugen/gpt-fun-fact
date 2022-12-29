import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";
import dayjs from "dayjs";
import { verifySignature } from "@upstash/qstash/nextjs";
import advancedFormat from "dayjs/plugin/advancedFormat";

import prisma from "../../lib/prisma";
import {
  getAdjectivesString,
  getEventCategory,
} from "../../lib/prompt-content";

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
    const adjectives = getAdjectivesString();
    const eventCategory = getEventCategory();

    const completion = await openai.createCompletion({
      max_tokens: 200,
      model: "text-davinci-003",
      prompt: `Make up a ${adjectives} historical fact about ${eventCategory} that could have happened on ${date}. The year of the fact should be somewhere between 1400 and 2021. Start the text with "On ${date}", followed by the year and then the fact. Make sure that the fact is not true. Make your response short, less than 240 characters.`,
      temperature: 0.9,
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
