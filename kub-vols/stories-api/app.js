import path from "path";
import fs from "fs";
import express from "express";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storyFolder = process.env.STORY_FOLDER || "stories";

const filePath = path.join(__dirname, storyFolder, "text.txt");

app.use(express.static(path.join(__dirname, "public")));

app.use(express.json({ limit: "10kb" }));

app.get("/", (_, res) => {
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <link rel="icon" type="image/x-icon" href="favicon.ico">
      <title>Story API</title>

    </head>
    <body>
      <div style="display: flex; justify-content: center; padding: 20px">
          <main>
            <h1>Stories API</h1>
            <p>Welcome to stories API.</p>
            <p>Below are the api end points</p>
            <ul>
              <li>Story GET</li>
              <li>Story POST</li>
            </ul>
            <h2>Data Format for POST end point</h2>
            <div>
              <pre style="background-color: #333; color: #fff; padding: 10px; border-radius: 4px"
              >{ "text": "Sample story text"}</pre>
            <div>
          </main>
        </div>
      </body>
    </html>
  `);
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

app.get("/error", () => {
  console.log("Crushing app!");

  process.exit(1);
});

const hostUrl = process.env.HOST_URL || "http://localhost:3000";
app.listen(3000, () => {
  console.log(`App running on ${hostUrl}`);
});
