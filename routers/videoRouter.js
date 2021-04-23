import express from "express";
import { deleteVideo, getEditVideo, getVideoUpload, postEditVideo, postVideoUpload, videoDetail } from "../controllers/videoController";
import {onlyPrivate, uploadVideo} from "../middlewares";
import routes from "../routes";

const videoRouter = express.Router();
videoRouter.get(routes.upload, onlyPrivate, getVideoUpload);
videoRouter.post(routes.upload, onlyPrivate, uploadVideo, postVideoUpload);
videoRouter.get(routes.videoDetail(), videoDetail);
videoRouter.get(routes.editVideo(), onlyPrivate, getEditVideo);
videoRouter.post(routes.editVideo(), onlyPrivate, postEditVideo);
videoRouter.get(routes.deleteVideo(), onlyPrivate, deleteVideo);
export default videoRouter;