const gttsFactory = require('node-gtts');
const gtts = gttsFactory('en');
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import * as edgeTTS from 'edge-tts';

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




export const textToSpeechWithEdge = async (req: Request, res: Response) => {
  const text = req.query.text as string;
  if (!text) return res.status(400).send('Text is required');

  const audio = await edgeTTS
    .synthesize({
      text,
      voice: 'en-US-AriaNeural', // Change voice here
    });

  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': 'inline; filename="tts.mp3"',
  });

  res.send(Buffer.from(audio.streamBuffer));
};
