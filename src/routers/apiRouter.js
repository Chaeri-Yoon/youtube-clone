import express from "express";
import { postAddComment, postDeleteComment, postRegisterView } from "../controllers/videoController";
import {onlyPrivate} from "../middlewares";
import routes from "../routes";

const apiRouter = express.Router();
apiRouter.post(routes.registerView, onlyPrivate, postRegisterView);
apiRouter.post(routes.addComment, onlyPrivate, postAddComment);
apiRouter.post(routes.deleteComment, onlyPrivate, postDeleteComment);
export default apiRouter;