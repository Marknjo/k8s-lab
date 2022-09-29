// import express, { Request, Response } from "express";
import express from "express";
import morgan from "morgan";

const app = express();

app.use(morgan("combined"));

app.get("/", (req, res) => {
  // app.get("/", (req: Request, res: Response) => {
  res.send(`
    <h1>Hello from this NodeJS app!</h1>
    <p>Try sending a request to /error and see what happens</p>
    <p>This lines is the first update of this test container</p>
  `);
});

app.get("/error", (req, res) => {
  // app.get("/error", (req: Request, res: Response) => {
  process.exit(1);
});

app.listen(8080, () => {
  console.log("Server running on http://localhost");
});
