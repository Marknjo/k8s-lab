import express from "express";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Auth API");
});

app.get("/verify-token/:token", (req, res) => {
  const token = req.params.token;

  // dummy verification!
  if (token === "abc") {
    return res.status(200).json({ message: "Valid token.", uid: "u1" });
  }
  res.status(401).json({ message: "Token invalid." });
});

app.get("/token/:hashedPassword/:enteredPassword", (req, res) => {
  const hashedPassword = req.params.hashedPassword;
  const enteredPassword = req.params.enteredPassword;

  // dummy password verification!
  if (hashedPassword === enteredPassword + "_hash") {
    const token = "abc";
    return res.status(200).json({ message: "Token created.", token: token });
  }
  res.status(401).json({ message: "Passwords do not match." });
});

app.get("/hashed-password/:password", (req, res) => {
  // dummy hashed pw generation!
  const enteredPassword = req.params.password;
  const hashedPassword = enteredPassword + "_hash";
  res.status(200).json({ hashedPassword: hashedPassword });
});

const port = process.env.PORT || 8000;
const host = process.env.HOST || "localhost";

app.listen(port, () => {
  const hostUrl = process.env.HOST_URL || `http://${host}:${port}`;
  console.log(`Server running on ${hostUrl}`);
});
