import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import PostController from "./api/post/PostController.js";
const app = express();
dotenv.config();

// cors middlesware
const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));
app.use(express.json());

app.use("/post", PostController);

const port = process.env.PORT || 8080;

app.listen(port, () => {
    console.log(`Server started in port ${port}`);
});