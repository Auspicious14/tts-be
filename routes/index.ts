import express from 'express';
import { textToSpeech, textToSpeechWithEdge, getAvailableVoicesInEdge, imageToSpeech } from '../controllers/index.js';

const router = express.Router();

router.get('/text-to-speech', textToSpeech)
router.get('/text-to-speech-with-edge', textToSpeechWithEdge)
router.get('/get-available-voices', getAvailableVoicesInEdge)
router.post('/image-to-speech', imageToSpeech)

export default router;
  
