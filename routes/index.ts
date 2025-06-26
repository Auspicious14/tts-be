import express from 'express';
import { textToSpeech } from '../controllers';

const router = express.Router();

router.post('/text-to-speech', textToSpeech)
export default router;
  