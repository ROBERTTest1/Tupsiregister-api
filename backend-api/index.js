require("dotenv").config();
const port = process.env.Port || 8080;
const host = "localhost";
const express = require("express");
const cors = require("cors");
const app = express();
const session = require('express-session')

const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");

const swaggerDocument = yamljs.load("./docs/swagger.yaml");
//const swaggerDocument = require("./docs/swagger.json");
const { sync, sessionStore } = require("./db");

//app.get("/worker", (req, res) => {
//  res.send(["Velo", "Killa", "Odens"]);
//});

app.use(cors());
app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));
app.use(express.json());

app.use(session({
  secret: process.env.SESSIONSECRET || "dev",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7*24*60*60*1000
  }
}))
sessionStore.sync();

require("./routes/rcRoutes.js")(app);

app.listen(port, async () => {
  if (process.env.SYNC === "true") {
    await sync();
  }
  console.log(`API on aadressil: http://${host}:${port}`);
});
//commit
