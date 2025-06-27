const gtts = require('better-node-gtts');
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

export const textToSpeech = expressAsyncHandler(async (req: Request, res: Response) => {
  const { text} = req.query;
  if (!text) {
    res.status(400).json({ success: false, message: 'Text is required' });
    return;
  }
  const gttsInstance = gtts().default;
  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': 'inline; filename="tts.mp3"'
  });
  gttsInstance.stream(text).pipe(res);
});
