import express from "express";
import passport from "passport";
import { getJoin, getLogin, githubLogin,logout, postJoin, postLogin, postGithubLogin, getMe, kakaoLogin, postKakaoLogin } from "../controllers/userController";
import {home, searchVideo} from "../controllers/videoController";
import {onlyPublic, onlyPrivate} from "../middlewares";
import routes from "../routes";

const globalRouter = express.Router();
globalRouter.get(routes.home, home);
globalRouter.get(routes.search, searchVideo);
globalRouter.get(routes.join, onlyPublic, getJoin); 
globalRouter.post(routes.join, onlyPublic, postJoin, postLogin);

globalRouter.get(routes.login, onlyPublic, getLogin);
globalRouter.post(routes.login, onlyPublic, postLogin);

globalRouter.get(routes.logout, onlyPrivate, logout);

globalRouter.get(routes.github, githubLogin);
globalRouter.get(
    routes.githubCallback, 
    passport.authenticate('github', {failureRedirect: "/login"}),
    postGithubLogin
);
globalRouter.get(routes.kakao, kakaoLogin);
globalRouter.get(
    routes.kakaoCallback, 
    passport.authenticate('kakao', {failureRedirect: "/login"}),
    postKakaoLogin
);


globalRouter.get(routes.me, getMe);
export default globalRouter;