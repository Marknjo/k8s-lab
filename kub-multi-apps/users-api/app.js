import express, { json } from "express";
import axios from "axios";

const app = express();

/// App Start
const port = process.env.PORT || 8002;
const host = process.env.HOST || "localhost";
const protocol = process.env.PROTOCOL || "http";

/// AUTH
const authSrvAddr = process.env.AUTH_ADDRESS || "auth";
const authSrvPort = process.env.AUTH_SRV_PORT || 8000;
const authHostUrl = `http://${authSrvAddr}:${authSrvPort}/auth`;

app.use(express.json());

app.get("/users/", (req, res) => {
  res.send("Users API");
});

app.post("/users/signup", async (req, res) => {
  // It's just a dummy service - we don't really care for the email
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: "An email and password needs to be specified!" });
  }

  try {
    const response = await axios.get(
      `${authHostUrl}/hashed-password/${password}`
    );

    const hashedPW = response.data.hashedPassword;

    // since it's a dummy service, we don't really care for the hashed-pw either
    console.log(hashedPW, email);
    console.table({ hashedPW, email });

    res.status(201).json({ message: "User created!" });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Creating the user failed - please try again later." });
  }
});

app.post("/users/login", async (req, res) => {
  // It's just a dummy service - we don't really care for the email
  const email = req.body.email;
  const password = req.body.password;

  if (
    !password ||
    password.trim().length === 0 ||
    !email ||
    email.trim().length === 0
  ) {
    return res
      .status(422)
      .json({ message: "An email and password needs to be specified!" });
  }

  // normally, we'd find a user by email and grab his/ her ID and hashed password
  const hashedPassword = password + "_hash";
  const response = await axios.get(
    `${authHostUrl}/token/${hashedPassword}/${password}`
  );
  if (response.status === 200) {
    return res.status(200).json({ token: response.data.token });
  }
  return res.status(response.status).json({ message: "Logging in failed!" });
});

app.listen(port, () => {
  const requiresPort = process.env.REQUIRE_PORT || "true";
  const hostUrl =
    requiresPort === "true"
      ? `${protocol}://${host}:${port}`
      : `${protocol}://${host}/users`;
  console.log(`Users server running on ${hostUrl}`);
});
