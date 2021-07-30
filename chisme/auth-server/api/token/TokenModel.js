import mongoose from "mongoose";
const schema = mongoose.Schema;

const TokenModel = new schema({
    refreshToken: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    
});

function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export default mongoose.model("Token", TokenModel);