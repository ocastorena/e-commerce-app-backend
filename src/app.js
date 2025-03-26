const express = require("express");
const session = require("express-session");
const cors = require("cors");

const swaggerSpec = require("./config/swaggerConfig");
const swaggerUi = require("swagger-ui-express");

const passport = require("./config/passportConfig");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

const app = express();
const port = 3000;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session configuration
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Add routes
app.use("/", userRoutes);
app.use("/", productRoutes);
app.use("/", cartRoutes);
app.use("/", orderRoutes);

// serve swagger spec
app.get("/swagger.json", function (req, res) {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

// serve swagger ui
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port, () => {
  console.log(`Server app listening on port ${port}`);
});

module.exports = app;
