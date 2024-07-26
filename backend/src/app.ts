import express, { Express, Request, Response } from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import axios from "axios";
import FormData from "form-data";
import dotenv from "dotenv";
import path from "path";
dotenv.config();

const port = process.env.PORT || 8000;
const app: Express = express();
app.use(express.json());
app.use(cors());

const secretKey = process.env.OPENAI_API_KEY;

if (!secretKey) {
  throw new Error("OPENAI_API_KEY is not defined in the environment variables");
}

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer to save files with the correct extension
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".").pop();
    cb(null, `${file.fieldname}-${Date.now()}.${ext}`);
  },
});

const upload = multer({ storage });

app.post("/completions", async (req: Request, res: Response) => {
    // Set up the options for the axios request to the OpenAI API
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${secretKey}`, // Authorization header with the secret key
    },
    data: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: req.body.message, // Message content from the request body
        },
      ],
    }),
  };

  try {
     // Make the request to the OpenAI API
    const response = await axios(
      "https://api.openai.com/v1/chat/completions",
      options
    );
      // Send the response data back to the client
    res.send(response.data);
  } catch (error: unknown) {
    const err = error as any;
    res.status(500).send(err.response ? err.response.data : err.message);
  }
});

app.post("/transcribe", upload.single("file"), async (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).send("No file uploaded.");
    }
    const filePath = req.file.path;

    // Verify file size
    const stats = fs.statSync(filePath);
    if (stats.size === 0) {
      fs.unlinkSync(filePath);
      return res.status(400).send("Uploaded file is empty.");
    }

    const form = new FormData();
    form.append("file", fs.createReadStream(filePath));
    form.append("model", "whisper-1");
    form.append("response_format", "text");

    try {
      const transcriptionResponse = await axios.post(
        "https://api.openai.com/v1/audio/transcriptions",
        form,
        {
          headers: {
            ...form.getHeaders(),
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );

      const transcribedText = {
        role: "user",
        content: transcriptionResponse.data.text || transcriptionResponse.data,
      };
      // Check if transcribedText is undefined or null
      if (!transcribedText.content) {
        console.error("Transcription failed, received undefined text.");
        return res
          .status(400)
          .send("Transcription failed, received undefined text.");
      }
      // Prepare messages for the chatbot, including the transcribed text
      const messages = [
        {
          role: "user",
          content: transcribedText.content,
        },
      ];
      // Send messages to the chatbot and get the response
      const chatResponse = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-4o-mini",
          messages,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${secretKey}`,
          },
        }
      );
      // Extract the chat response
      const chatResponseText = chatResponse.data.choices[0].message;
      // Send the chat response back to the client
      const responsePayload = {
        transcribedText,
        chatResponseText,
      };
      res.send(responsePayload);
      // Delete the uploaded file after processing if you dont needed, if you need it then comment fs.unlink
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete temporary file:", err);
        }
      });
    } catch (error: unknown) {
      const err = error as any;
      console.error(err.response ? err.response.data : err.message);
      res.status(500).send(err.response ? err.response.data : err.message);
      // Delete the uploaded file in case of error
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error("Failed to delete temporary file:", err);
        }
      });
    }
  }
);

app.listen(port, () => {
  console.log(`[server]: Server is running at ${port}`);
});

