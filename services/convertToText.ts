import { OpenAI } from "openai";
import dotenv from "dotenv";
import { cleanText } from "../utils/cleanText";

dotenv.config();

const openRouter = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY!,
});

interface IRefineOptions {
  image: string;
}

export const convertImageToTextWithAI = async ({
  image,
}: IRefineOptions): Promise<string> => {
  const systemPrompt = `You are an OCR expert. Extract and return only the exact visible text from the uploaded image. Do not describe the image, interpret it, or include any additional comments. Return only the text exactly as it appears.`;
  const messages = [
    { role: "system", content: systemPrompt },
    {
      type: "image_url",
      image_url: {
        url: image,
      },
    },
  ];

  const completion = await openRouter.chat.completions.create({
    model: "google/gemini-2.0-flash-exp:free",
    messages: messages as Array<{
      role: "system" | "user" | "assistant";
      content: string;
    }>,
  });

  if (!completion.choices[0]?.message?.content) {
    throw new Error("Failed to get image description from AI");
  }
  const rawText = completion.choices[0].message.content;
  console.log({ rawText });
  return cleanText(rawText);
};
