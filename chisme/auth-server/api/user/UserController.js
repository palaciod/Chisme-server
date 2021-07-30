import express from "express";
import Auth from "../../helpers/auth/Auth.js";
const router = express.Router();


router.get("/bleep", Auth.authorizeToken, (req,res) => {
    res.send("bleep");
});

/**
 * Req.user is obtained from Auth.validateRegisterInput
 */
router.post("/register", Auth.validateRegisterInput, async (req,res) => {
    try{
        let result = await Auth.setUpUserForRegister(req.user);
        const passed = result[0];
        const value = result[1];
        if(!passed) return res.status(404).send(value);
        Auth.save(value);
        res.json(value);
    }catch(error){
        console.log(error);
    }
});

router.post("/login", Auth.validateLoginInput, async (req,res) => {
    try{
        let result = await Auth.login(req.user);
        const passed = result[0];
        const value = result[1];
        if(!passed) return res.status(404).send(value);
        let user = result[1];
        console.log(result);
        const aToken = Auth.getAccessToken(user, '7d');
        const rToken = Auth.saveRegisterToken(user);
        // cookie will need a domain in production
        res.cookie("rToken", rToken, { path: '/', secure: true, httpOnly: true, signed: true, sameSite: "none" }).json({accessToken: aToken, user: user});
    }catch(error){
        console.log(error);
    }
});

router.delete("/logout", async (req,res) => {
    try{
        const refreshToken = req.signedCookies.rToken;
        Auth.logout(refreshToken);
        console.log("Logged out");
        res.send("Logged Out");
    }catch(error){
        console.log(error);
    }
});



export default router;