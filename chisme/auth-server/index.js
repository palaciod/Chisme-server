import dotenv from "dotenv";
import express from "express";
import UserController from "./api/user/UserController.js";
import TokenController from "./api/token/TokenController.js";
import cookieParser from 'cookie-parser';
import mongoose from "mongoose"
import cors from "cors";
const app = express();
dotenv.config();

app.use(cookieParser(process.env.COOKIE_SECRET));// Cookies will now be encrypted with our secret
app.use(express.json()); // Our app will now be able to process json objects

// cors middlesware
const corsOptions = {
    credentials: true,
    origin: "http://localhost:3000",
    optionsSuccessStatus: 200
}

app.use(cors(corsOptions));



mongoose.connect( process.env.MONGO_URI || "mongodb://localhost/chisme",
    {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }

).then(() => {
    console.log("Mongodb started....");
}).catch(error => {console.log(error)});


app.use("/user", UserController);
app.use("/token", TokenController);

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});