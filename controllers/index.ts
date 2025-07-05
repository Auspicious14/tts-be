const gttsFactory = require("node-gtts");
const gtts = gttsFactory("en");
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { EdgeTTS } from "@andresaya/edge-tts";
import { voiceConfig } from "../utils/voice";
import { convertImageToTextWithAI } from "../services/convertToText";
import { mapFiles } from "../middlewares/file";

export const textToSpeech = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { text } = req.query;
    if (!text) {
      res.status(400).json({ success: false, message: "Text is required" });
      return;
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="tts.mp3"',
    });
    gtts.stream(text).pipe(res);
  }
);

export const textToSpeechWithEdge = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const query = req.query;

    const { text, voice = "en-NG-AbeoNeural" } = query;

    if (!text || typeof text !== "string") {
      res.status(400).send({ success: false, message: "Text is required" });
      return;
    }
    if (!voice || typeof voice !== "string") {
      res.status(400).send({ success: false, message: "Voice is required" });
      return;
    }

    const tts = new EdgeTTS();
    await tts.synthesize(text as string, voice as string, {
      rate: "0%",
      pitch: "0Hz",
      volume: "0%",
    });

    const audio = await tts.toRaw();
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="tts.mp3"',
      "Content-Length": Buffer.byteLength(audio, "base64"),
    });
    const buffer = Buffer.from(audio, "base64");
    res.send(buffer);
  }
);

export const imageToSpeech = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const { image, voice = "en-US-JennyNeural" } = req.body;
    if (!image) {
      res.status(400).json({ success: false, message: "Image is required" });
      return;
    }
    const files = await mapFiles([image]);
    if (!files[0]) {
      res.status(400).json({ success: false, message: "Image is required" });
      return;
    }
    const description = await convertImageToTextWithAI({ image: files[0].uri });
    // Step 2: Synthesize speech from text
    const tts = new EdgeTTS();
    await tts.synthesize(description, voice, {
      rate: "0%",
      pitch: "0Hz",
      volume: "0%",
    });
    const audio = await tts.toRaw();
    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'inline; filename="image-to-speech.mp3"',
      "Content-Length": Buffer.byteLength(audio, "base64"),
    });
    const buffer = Buffer.from(audio, "base64");
    res.send(buffer);
  }
);

export const getAvailableVoicesInEdge = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const tts = new EdgeTTS();
    const voices = await tts.getVoices();

    const filteredVoices = voices.filter((voice) =>
      voiceConfig.map((config) => config.voice).includes(voice.ShortName)
    );
    const formattedVoices = filteredVoices.map((voice) => {
      const config = voiceConfig.find((c) => c.voice === voice.ShortName);
      return {
        name: config?.name,
        voice: voice.ShortName,
        gender: config?.gender,
        country: config?.country,
        // ...voice,
      };
    });

    res.status(201).json({ success: true, data: formattedVoices });
  }
);
