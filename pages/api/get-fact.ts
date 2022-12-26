import type { NextApiRequest, NextApiResponse } from "next";
import { Configuration, OpenAIApi } from "openai";

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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured",
      },
    });
    return;
  }

  try {
    const completion = await openai.createCompletion({
      max_tokens: 40,
      model: "text-davinci-003",
      prompt:
        'Give me a short fun, positive and uplifting fact about a historical event that happened on December 30th. Start the text with "On December 30th", followed by the year and then the fact. Make your response short, less than 250 letters.',
      temperature: 0.6,
    });
    // Save in DB?
    // res.status(200).json({ result: "Successfully generated fact" });
    // console.log(completion.data.choices);
    res.status(200).json({ result: completion.data.choices[0].text as string });
  } catch (error: any) {
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}