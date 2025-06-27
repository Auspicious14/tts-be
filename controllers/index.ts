const gttsFactory = require('node-gtts');
const gtts = gttsFactory('en');
import expressAsyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { EdgeTTS } from '@andresaya/edge-tts';

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




export const textToSpeechWithEdge = expressAsyncHandler(async (req: Request, res: Response) => {
  const {text, voice = 'en-US-AriaNeural'} = req.query

  if (!text) return res.status(400).send('Text is required');

  const tts = new EdgeTTS();
  await tts.synthesize(text as string, voice as string);

  const buffer = Buffer.from(await tts.toRaw());

  res.set({
    'Content-Type': 'audio/mpeg',
    'Content-Disposition': 'inline; filename="tts.mp3"',
  });

  res.send(buffer);
});


export const getAvailableVoicesInEdge = expressAsyncHandler(async (req: Request, res: Response) => {
  const tts = new EdgeTTS()
  const voices = await tts.getVoices()
  res.status(201).json({success: true, data: voices})
})
