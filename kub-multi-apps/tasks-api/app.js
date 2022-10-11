import path from "path";
import fs from "fs";

import express from "express";
import cors from "cors";
import axios from "axios";
import { fileURLToPath } from "url";
import { env } from "process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filePath = path.join(__dirname, process.env.TASKS_FOLDER, "tasks.txt");

const app = express();

app.use(cors());

app.use(express.json());

app.get("/tasks/health-check", (req, res) => {
  res.send("Tasks API");
});

const extractAndVerifyToken = async (headers) => {
  if (!headers.authorization) {
    throw new Error("No token provided.");
  }
  const token = headers.authorization.split(" ")[1]; // expects Bearer TOKEN

  const authAddr = env.AUTH_ADDRESS || "auth-srv";
  const authPort = env.AUTH_PORT || 8000;
  const authHostUrl = `http://${authAddr}:${authPort}/auth`;

  const response = await axios.get(`${authHostUrl}/verify-token/${token}`);
  return response.data.uid;
};

app.get("/tasks", async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); // we don't really need the uid
    fs.readFile(filePath, (err, data) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Loading the tasks failed." });
      }
      const strData = data.toString();
      const entries = strData.split("TASK_SPLIT");
      entries.pop(); // remove last, empty entry
      console.log(entries);
      const tasks = entries.map((json) => JSON.parse(json));
      res.status(200).json({ message: "Tasks loaded.", tasks: tasks });
    });
  } catch (err) {
    console.log(err);
    return res
      .status(401)
      .json({ message: err.message || "Failed to load tasks." });
  }
});

app.post("/tasks/create/task", async (req, res) => {
  try {
    const uid = await extractAndVerifyToken(req.headers); // we don't really need the uid
    const text = req.body.text;
    const title = req.body.title;
    const task = { title, text };
    const jsonTask = JSON.stringify(task);

    fs.appendFile(filePath, jsonTask + "TASK_SPLIT", (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ message: "Storing the task failed." });
      }
      res.status(201).json({ message: "Task stored.", createdTask: task });
    });
  } catch (err) {
    return res.status(401).json({ message: "Could not verify token." });
  }
});

const port = process.env.PORT || 8001;
const host = process.env.HOST || "localhost";
const protocol = process.env.PROTOCOL || "http";

app.listen(port, () => {
  const requiresPort = process.env.REQUIRE_PORT || "true";

  const hostUrl =
    requiresPort === "true"
      ? `${protocol}://${host}:${port}`
      : `${protocol}://${host}/tasks`;
  console.log(`Tasks server running on ${hostUrl}`);
});
