import routes from "../routes";
import Video from "../models/Video";
import Comment from "../models/Comment";

export const home = async(req, res) => {
    try{
        const videos = await Video.find({}).sort(
            {_id: -1}
        );
        res.render("home", {pageTitle: "Home", videos});
    }
    catch(error){
        console.log(error);
        res.render("home", {pageTitle: "Home", videos: []});
    }
};
export const searchVideo = async(req, res) => {
    const {query: {term}} = req;
    let videos = [];
    try{
        videos = await Video.find({title: {$regex: term, $options: "i"}});
        res.render("search", {pageTitle: "Search", term, videos});
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
}
export const getVideoUpload = (req, res) => res.render("videoUpload", {pageTitle:"video upload"});
export const postVideoUpload = async (req, res) => {
    const{
        body: {title, description},
        file: {path}
    } = req;
    const newVideo = await Video.create({
        title,
        description,
        fileUrl: path,
        creator: req.user._id
    });
    req.user.videos.push(newVideo._id);
    req.user.save();
    res.redirect(routes.videoDetail(newVideo._id));
}
export const videoDetail = async (req, res) => {
    const{
        params : {id}
    } = req;
    try{
        const foundVideo = await Video.findById(id).populate('creator').populate('comments');
        res.render("videoDetail", {pageTitle: foundVideo.title, video: foundVideo});
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
}
export const getEditVideo = async (req, res) => {
    const{
        params: {id}
    } = req;
    try{
        const foundVideo = await Video.findById(id);
        if(!foundVideo.creator.equals(req.user._id)) throw Error();
        else res.render("editVideo", {pageTitle: `Edit ${foundVideo.title}`, video: foundVideo});
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
};
export const postEditVideo = async (req, res) => {
    const{
        params: {id},
        body: {title, description}
    } = req;
    try{
        await Video.findOneAndUpdate({_id:id}, {
            title,
            description
        });
        res.redirect(routes.videoDetail(id));
    }catch(error){
        console.log(error);
        res.redirect(routes.home);
    }
};
export const deleteVideo = async (req, res) => {
    const{
        params : {id}
    } = req;
    try{
        const foundVideo = await Video.findById(id);
        if(!foundVideo.creator.equals(req.user._id)){
            throw Error();
        }
        else{
            const updatedUserVideos = req.user.videos.filter(ele => {
                return ele._id.toString() !== id 
            });
            req.user.videos = updatedUserVideos;
            req.user.save();

            for(let i = 0; i < foundVideo.comments.length; i++){
                await Comment.findByIdAndRemove(foundVideo.comments[i].toString());
            }
            await Video.findOneAndRemove({_id:id});
        }
    }catch(error){
        console.log(error);
    }
    res.redirect(routes.home);
}
export const postRegisterView = async(req, res) => {
    const {
        params: {id}
    } = req;

    try{
        const foundVideo = await Video.findById(id);
        foundVideo.views += 1;
        foundVideo.save();
        res.status(200);
    }catch(error){
        console.log(error);
        res.status(400);
    }finally{
        res.end();
    }
}
export const postAddComment = async(req, res) => {
    const {
        params: {id},
        body: {comment},
        user
    } = req;
    let newComment;
    try{
        const foundVideo = await Video.findById(id);
        newComment = await Comment.create({
            text: comment,
            creator: user.id
        });
        req.user.comments.push(newComment.id);
        foundVideo.comments.push(newComment.id);

        req.user.save();
        foundVideo.save();
    }catch(error){
        console.log(error);
        res.status(400);
    }finally{
        res.send({"comment-id":newComment.id});
    }
}
//Delete Comment
export const postDeleteComment = async (req, res) => {
    const {
        params: {id},
        body: {commentId}
    } = req;

    try{
        const foundVideo = await Video.findById(id);
        const updatedVideoComments = foundVideo.comments.filter(ele => {
            return ele._id.toString() !== commentId 
        });
        foundVideo.comments = updatedVideoComments;
        foundVideo.save();

        const updatedUserComments = req.user.comments.filter(ele => {
            return ele._id.toString() !== commentId 
        });
        req.user.comments = updatedUserComments;
        req.user.save();
        await Comment.findOneAndRemove({_id:commentId});
    }catch(error){
        console.log(error);
        res.status(400);
    }finally{
        res.end();
    }
}