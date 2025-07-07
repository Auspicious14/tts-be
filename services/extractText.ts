import Tesseract from "tesseract.js";
const franc = await import('franc').then(m => m.default);

export const extractTextFromImage = async (
  imagePath: string
): Promise<{ text: string; lang: string }> => {
  const { data } = await Tesseract.recognize(imagePath, "eng+fra+ara+yor+deu", {
    logger: (m) => console.log(m), // optional
  });

  const rawText = data.text.trim();

  // Step 2: Detect language from raw OCR text
  const langCode = franc.franc(rawText); // ISO 639-3 (e.g., 'eng', 'fra')

  return {
    text: rawText,
    lang: langCode,
  };
};
