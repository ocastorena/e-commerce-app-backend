const express = require("express");
const session = require("express-session");
const passport = require("./config/passportConfig");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");

const app = express();
const port = 3000;

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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

module.exports = app;
