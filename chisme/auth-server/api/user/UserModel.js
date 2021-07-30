import mongoose from "mongoose";
const schema = mongoose.Schema;

const UserModel = new schema({
    number: {
        type: String,
        require: false
    },
    username: {
        type: String,
        require: false
    },
    password: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        default: Date.now()
    }
});

export default mongoose.model("User", UserModel);