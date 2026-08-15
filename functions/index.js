const { onRequest } = require("firebase-functions/v2/https");
const OpenAI = require("openai");

exports.generateImage = onRequest(
  { region: "us-east1", cors: true, secrets: ["OPENAI_API_KEY"] },
  async (req, res) => {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Only POST is supported." });
      return;
    }

    const prompt = typeof req.body?.prompt === "string" ? req.body.prompt.trim() : "";
    const count = Number(req.body?.n || 1);
    const size = req.body?.size || "256x256";

    if (!prompt) {
      res.status(400).json({ error: "prompt is required." });
      return;
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    try {
      const response = await client.images.generate({
        model: process.env.OPENAI_IMAGE_MODEL || "dall-e-3",
        prompt,
        n: Math.min(Math.max(count, 1), 4),
        size,
      });
      res.status(200).json({ data: response.data });
    } catch (error) {
      console.error("Image generation failed:", error);
      res.status(502).json({ error: "Image generation failed." });
    }
  }
);
