import express from "express";
import cors from "cors";

const app = express();
app.use(cors());

app.use(express.json());

app.get("/auth", (req, res) => {
  console.log("auth");

  res.send("Auth API");
});

app.get("/auth/verify-token/:token", (req, res) => {
  const token = req.params.token;

  // dummy verification!
  if (token === "abc") {
    return res.status(200).json({ message: "Valid token.", uid: "u1" });
  }
  res.status(401).json({ message: "Token invalid." });
});

app.get("/auth/token/:hashedPassword/:enteredPassword", (req, res) => {
  const hashedPassword = req.params.hashedPassword;
  const enteredPassword = req.params.enteredPassword;

  // dummy password verification!
  if (hashedPassword === enteredPassword + "_hash") {
    const token = "abc";
    return res.status(200).json({ message: "Token created.", token: token });
  }
  res.status(401).json({ message: "Passwords do not match." });
});

app.get("/auth/hashed-password/:password", (req, res) => {
  // dummy hashed pw generation!
  const enteredPassword = req.params.password;
  const hashedPassword = enteredPassword + "_hash";
  res.status(200).json({ hashedPassword: hashedPassword });
});

const port = process.env.PORT || 8000;
const host = process.env.HOST || "localhost";
const protocol = process.env.PROTOCOL || "http";

app.listen(port, () => {
  const requiresPort = process.env.REQUIRE_PORT || "true";

  const hostUrl =
    requiresPort === "true"
      ? `${protocol}://${host}:${port}`
      : `${protocol}://${host}/auth`;
  console.log(`Auth server running on ${hostUrl}`);
});
