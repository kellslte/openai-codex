import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

dotenv.config();

const config = new Configuration({
  apiKey: process.env.OPEN_AI_SECRET_KEY,
});

const openai = new OpenAIApi(config);

const app = express();

app.use(cors());

app.use(express.json());

app.get("/api/v1/", async (req, res) => {
  res.status(200);

  res.send({
    successful: true,
    message: "Hello, world from Codex",
    data: {},
  });
});

app.post("/api/v1/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const { data } = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${prompt}`,
      temperature: 0,
      max_tokens: 64,
      top_p: 1,
      frequency_penalty: 0.5,
      presence_penalty: 0,
    });

    res.status(200);

    res.send({
      successful: true,
      message: "Success",
      data: {
        bot: data.choices[0].text,
      },
    });
  } catch (e) {
    res.status(400);

    return res.json({
      successful: false,
      error_code: e.code,
      message: e.message,
      data: {},
    });
  }
});

app.listen(3000, () => console.log("listening on port 3000"));
