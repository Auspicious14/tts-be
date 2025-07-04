type Provider = "openrouter" | "groq";
type ModelName = string;
import { OpenAI } from "openai";
import { openRouter, groq } from "./sdk";

export const chatWithProvider = async (
  provider: Provider,
  model: ModelName,
  messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) => {
  const client = provider === "openrouter" ? openRouter : groq;

  return client.chat.completions.create({
    model,
    messages,
  });
};
