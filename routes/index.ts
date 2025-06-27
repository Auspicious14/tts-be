import express from 'express';
import { textToSpeech, textToSpeechWithEdge, getAvailableVoicesInEdge } from '../controllers';

const router = express.Router();

router.get('/text-to-speech', textToSpeech)
router.get('/text-to-speech-with-edge', textToSpeechWithEdge)
router.get('/get-available-voices', getAvailableVoicesInEdge)

export default router;
  
