const express = require("express");
const { query } = require("./db/db.js");

const app = express();
const port = 3000;

query("SELECT NOW()");

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
