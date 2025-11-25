require("dotenv").config();
const port = process.env.Port || 8080;
const host = "localhost";
const express = require("express");
const cors = require("cors");
const app = express();

const swaggerUI = require("swagger-ui-express");
const yamljs = require("yamljs");

const swaggerDocument = yamljs.load("./docs/swagger.yaml");
//const swaggerDocument = require("./docs/swagger.json");

app.get("/tups", (req, res) => {
  res.send(["Velo", "Killa", "Odens"]);
});

app.use("/docs", swaggerUI.serve, swaggerUI.setup(swaggerDocument));

app.listen(port, () => {
  console.log(`API on aadressil: http://localhost:${port}`);
});
