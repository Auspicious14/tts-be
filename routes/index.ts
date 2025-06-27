import express from 'express';
import { textToSpeech, textToSpeechWithEdge } from '../controllers';

const router = express.Router();

router.get('/text-to-speech', textToSpeech)
router.get('/text-to-speech-with-edge', textToSpeechWithEdge)

export default router;
  
