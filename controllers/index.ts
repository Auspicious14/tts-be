import gtts from 'node-gtts';
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

export const textToSpeech = expressAsyncHandler(async (req: Request, res: Response) => {
  const { text, lang = 'en' } = req.body;
  if (!text) {
    res.status(400).json({ success: false, message: 'Text is required' });
    return;
  }
  const gttsInstance = gtts(lang);
  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': 'inline; filename="tts.mp3"'
  });
  gttsInstance.stream(text).pipe(res);
});