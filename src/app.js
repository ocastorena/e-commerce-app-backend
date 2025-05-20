const express = require("express");
const session = require("express-session");
const cors = require("cors");
const path = require("path");

const swaggerSpec = require("./config/swaggerConfig");
const swaggerUi = require("swagger-ui-express");

const passport = require("./config/passportConfig");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const checkAuthentication = require("./middleware/authMiddleware");

const app = express();
const port = 3000;

// CORS setup
const corsOptions = {
  origin: true,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session configuration
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
    },
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Add routes
app.get("/session", (req, res) => {
  if (req.isAuthenticated()) {
    res.status(200).json({ data: req.user });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
});
app.use("/", userRoutes);
app.use("/", checkAuthentication, productRoutes);
app.use("/", checkAuthentication, cartRoutes);
app.use("/", checkAuthentication, orderRoutes);

app.use("/images", express.static(path.join(__dirname, "../images")));

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
