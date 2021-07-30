import express from "express";
const router = express.Router();
import Token from "./TokenModel.js";
import jwt from "jsonwebtoken";
router.get("/login", async (req, res) => {
    try{
        const refreshToken = req.signedCookies.rToken;
        if(refreshToken === undefined) return res.status(403).send("Invalid token");
        const token = await Token.findOne({refreshToken: refreshToken});
        if(token){
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (error, user) => {
                if (error) return res.status(403).send("Invalid token");
                const accessToken = jwt.sign({username: user.username, id: user.id}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '7d'});
                res.json({accessToken: accessToken, user: user});
            });
        }else{
            return res.status(403).send("Invalid token");
        }
    }catch(error){
        console.log(error);
        res.send(error);
    }
});


export default router;