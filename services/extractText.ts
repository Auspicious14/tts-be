import Tesseract from "tesseract.js";
import { franc } from "franc";

export const extractTextFromImage = async (
  imagePath: string
): Promise<{ text: string; lang: string }> => {
  const { data } = await Tesseract.recognize(imagePath, "eng+fra+ara+yor+deu");

  const rawText = data.text.trim();

  const langCode = franc(rawText);
  return {
    text: rawText,
    lang: langCode,
  };
};
