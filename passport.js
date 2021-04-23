import passport from "passport";
import GithubStrategy from "passport-github";
import KakaoStrategy from "passport-kakao";
import { githubLoginCallback, kakaoLoginCallback } from "./controllers/userController";
import User from "./models/User";
import routes from "./routes";

passport.use(User.createStrategy());
passport.use(
    new GithubStrategy({
    clientID: process.env.GH_ID,
    clientSecret: process.env.GH_SECRET,
    callbackURL: `http://localhost:${process.env.PORT}${routes.githubCallback}`,
    }, githubLoginCallback)
);
passport.use(new KakaoStrategy({
    clientID : process.env.KT_ID,
    clientSecret: process.env.KT_SECRET, // clientSecret을 사용하지 않는다면 넘기지 말거나 빈 스트링을 넘길 것
    callbackURL : `http://localhost:${process.env.PORT}${routes.kakaoCallback}`,
  }, kakaoLoginCallback
))

passport.serializeUser(function (user, done) {
    done(null, user);
    });
    
    passport.deserializeUser(function(id, done){
        User.findById(id, function(err, user){
        done(err, user);
        });
    });
