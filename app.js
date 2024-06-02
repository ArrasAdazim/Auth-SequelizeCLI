const express = require("express");
const app = express();
const dotenv = require("dotenv");
const authRoutes = require("./routes/authRoute");
const userDetailRoute = require("./routes/userDetailRoute");
dotenv.config();

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/user-details", userDetailRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
