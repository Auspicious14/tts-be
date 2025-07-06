export function cleanText(text: string): string {
  return text
    .replace(/\r/g, "") // Remove carriage returns
    .replace(/\t/g, " ") // Convert tabs to spaces
    .replace(/\n{2,}/g, "\n") // Collapse multiple newlines
    .replace(/[ ]{2,}/g, " ") // Collapse multiple spaces
    .trim(); // Trim leading/trailing spaces
}
