const gttsFactory = require('node-gtts');
const gtts = gttsFactory('en');
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';

export const textToSpeech = expressAsyncHandler(async (req: Request, res: Response) => {
  const { text} = req.query;
  if (!text) {
    res.status(400).json({ success: false, message: 'Text is required' });
    return;
  }
 
  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': 'inline; filename="tts.mp3"'
  });
  gtts.stream(text).pipe(res);
});
