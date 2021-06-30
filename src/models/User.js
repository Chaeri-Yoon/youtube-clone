import mongoose from "mongoose";
import passport from "passport-local-mongoose";

const UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    avatarUrl: String,
    kakaoId: Number,
    githubId: Number,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video"
    }],
})
UserSchema.plugin(passport, {usernameField: "email"});
const model = mongoose.model("User", UserSchema);

export default model;