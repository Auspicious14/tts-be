//@ts-ignore
const { default: gttsFactory } = await import("node-gtts");
const gtts = gttsFactory("en");
import expressAsyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { EdgeTTS } from "@andresaya/edge-tts";
import { mapFiles } from "../middlewares/file";
import { groupVoicesByCountry } from "../utils/groupVoice";
import dotenv from "dotenv";
dotenv.config();

const microserviceUrl = process.env.OCR_MICROSERVICE_URL || "";

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
    const { image } = req.body;
    if (!image) {
      res.status(400).json({ success: false, message: "Image is required" });
      return;
    }

    const files = await mapFiles([image]);
    if (!files[0]) {
      res.status(400).json({ success: false, message: "Image is required" });
      return;
    }

    const ocrResponse = await fetch(`${microserviceUrl}/extract-text`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ imageBase64: image.split(",")[1] }),
    });

    if (!ocrResponse.ok) {
      throw new Error(
        "Failed to extract text from image using OCR microservice"
      );
    }

    const { text, lang } = await ocrResponse.json();
    console.log({ text, lang });
    const langToVoice = {
      eng: "en-US-JennyNeural",
      fra: "fr-FR-DeniseNeural",
      ara: "ar-SA-ZariyahNeural",
      deu: "de-DE-KatjaNeural",
    };

    const ttsVoice =
      lang in langToVoice
        ? langToVoice[lang as keyof typeof langToVoice]
        : "en-US-JennyNeural";
    const tts = new EdgeTTS();
    await tts.synthesize(text, ttsVoice, {
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

    const formattedVoices = groupVoicesByCountry(voices);

    res.status(201).json({ success: true, data: formattedVoices });
  }
);
