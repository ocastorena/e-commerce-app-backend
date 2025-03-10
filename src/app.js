const express = require("express");
const userRoutes = require("./routes/userRoutes");

const app = express();
const port = 3000;

app.use(express.json());
app.use("/", userRoutes);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
