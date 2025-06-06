require("dotenv").config();
const express = require("express");
const session = require("express-session");
const pgSession = require("connect-pg-simple")(session);
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
const { pool } = require("./config/db"); // Use your existing pg Pool

const app = express();

// Trust the first proxy (Render)
app.set('trust proxy', 1);

const port = process.env.PORT || 3000;

// CORS setup
const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
};
app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Express session configuration
app.use(
  session({
    store: new pgSession({
      pool: pool,
      tableName: "session",
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    },
  })
);

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

// Add public routes BEFORE checkAuthentication
app.get("/test-cookie", (req, res) => {
  res.cookie("testcookie", "testvalue", {
    secure: true,
    httpOnly: true,
    sameSite: "none",
    // domain: ".onrender.com", // try with and without this
  });
  res.send("Test cookie set");
});

// Add authenticated routes AFTER
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
