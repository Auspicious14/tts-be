import { OpenAI } from "openai";

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
  const systemPrompt = `You are a helpful assistant that converts images to detailed textual descriptions. Please describe the image content clearly and comprehensively.`;
  const messages = [
    { role: "system", content: systemPrompt },
    { role: "user", content: prompt },
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
  return completion.choices[0].message.content;
};
