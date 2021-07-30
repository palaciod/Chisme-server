import dotenv from "dotenv";
import jwt from "jsonwebtoken";
dotenv.config();
class Token {
    static authorizeToken(req, res, next){
        console.log(req.headers);
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        console.log(process.env.ACCESS_TOKEN_SECRET);
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) return res.status(403).send("Token is invalid");
            req.user = user;
            next();
        });     
    }
}

export default Token;