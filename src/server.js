// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());

// mongodb connect
mongoose
    .connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    })
    .then(() => console.log("DB CONNECTED"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => {
    res.status(200).json({
        message: "Root route success",
    });
});

const authRoutes = require("./routes/auth");

app.use("/auth", authRoutes);

const port = process.env.PORT;

app.listen(port, () => console.log(`SERVER STARTED AT PORT ${port}`));
