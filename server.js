const express = require("express");
const authRoutes = require("./routes/authRoutes");
const bodyParser = require("body-parser");
const routes = require("./routes/routes");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

const PORT = 3000;

app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use("/", routes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Server is Active" });
});

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
