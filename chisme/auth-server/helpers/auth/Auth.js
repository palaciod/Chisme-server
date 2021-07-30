import Validator from "../Validator.js";
import UserModel from "../../api/user/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import TokenModel from "../../api/token/TokenModel.js";
dotenv.config();
class Auth {
    static validateInput(result, fields, req, res, next){
        let passed = result[0];
        if(passed){
            console.log("All fields passed validation");
            req.user = fields;
            next();
        }else{
            const property = result[1];
            console.log(`Please enter ${property}`);
            res.status(404).send(`Please enter ${property}`);
        }
    }
    static validateRegisterInput(req, res, next){
        const {username, password, secondPassword, number} = req.body;
        const fields = {username: username, password: password, secondPassword: secondPassword, number: number};
        let result = Validator.validateAllFields(fields, res);
        Auth.validateInput(result, fields, req, res, next);
    }

    static validateLoginInput( req, res, next){
        const {username, password} = req.body;
        const fields = {username: username, password: password};
        let result = Validator.validateAllFields(fields, res);
        Auth.validateInput(result, fields, req, res, next);
    }

    static async validateUsername(username){
        try{
            const user = await UserModel.findOne({username: username});
            if(user) return [true, user];
            return false;
        }catch(error){
            console.log(error);
            return false;
        }
    }
    
    static async setHashedPassword(password){
        try{
            const hashedPassword = await bcrypt.hash(password + "", 15);
            return hashedPassword;
        }catch(error){
            console.log(error);
            return false;
        }
    }

    static async setUpUserForRegister(user){
        if (user.password !== user.secondPassword) return [false, "Passwords do not match"];
        try{
            let result = await Auth.validateUsername(user.username);
            let usernameExistStatus = result[0];
            if(usernameExistStatus) return [false, "Username is taken"];
            const hashedPassword = await this.setHashedPassword(user.password, user);
            user.password = hashedPassword;
            delete user.secondPassword;
            return [true, user];
        }catch(error){
            console.log(error);
        }
    }
    static save(user){
        const newUser = new UserModel(user);
        newUser.save();
    }

    static async comparePasswords(passwordEntered, passwordStored){
        try{
            const status = await bcrypt.compare(passwordEntered, passwordStored);
            return status;
        }catch(error){
            console.log(error);
            return false;
        }
    }

    static getAccessToken(data, lifeSpan){
        const accessToken = jwt.sign({data}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: `${lifeSpan}`});
        return accessToken;
    }
    static getRefreshToken(data){
        const refreshToken = jwt.sign({data}, process.env.REFRESH_TOKEN_SECRET);
        return refreshToken;
    }

    static saveRegisterToken(data){
        let refreshToken = Auth.getRefreshToken(data);
        new TokenModel({refreshToken: refreshToken}).save();
        return refreshToken;
    }

    static async logout(refreshToken){
        try{
            await TokenModel.deleteOne({refreshToken: refreshToken});
        }catch(error){
            console.log(error);
            return error;
        }
    }

    static async login(user){
        try{
            let result = await Auth.validateUsername(user.username);
            let usernameExistStatus = result[0];
            let resultUser = result[1];
            if(!usernameExistStatus) return [false, "Failed to login"]
            let passwordsMatch = await Auth.comparePasswords(user.password, resultUser.password);
            if(!passwordsMatch) return [false, "Failed to login"];
            resultUser.password = undefined;
            return [true, resultUser];
        }catch(error){
            console.log(error);
        }
    }

    static authorizeToken(req, res, next){
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) return res.status(403).send("Token is invalid");
            req.user = user;
            next();
        });     
    }
}

export default Auth;