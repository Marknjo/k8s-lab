import path from "path";
import fs from "fs";

import express from "express";
import { fileURLToPath } from "url";

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, "story", "text.txt");

app.use(express.json({ limit: "10k" }));

app.get("/", (req, res) => {
  res.send("<h1>App running</h1>");
});

app.get("/story", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Failed to open file." });
    }
    res.status(200).json({ story: data.toString() });
  });
});

app.post("/story", (req, res) => {
  const newText = req.body.text;
  if (newText.trim().length === 0) {
    return res.status(422).json({ message: "Text must not be empty!" });
  }
  fs.appendFile(filePath, newText + "\n", (err) => {
    if (err) {
      return res.status(500).json({ message: "Storing the text failed." });
    }
    res.status(201).json({ message: "Text was stored!" });
  });
});

app.listen(3000, () => {
  console.log(`Server listening in port 3000, http://localhost/`);
});
