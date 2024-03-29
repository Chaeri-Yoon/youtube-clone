import routes from "../routes";
import User from "../models/User";
import passport from "passport";

export const getJoin = (req, res) => {
    res.render("join", { pageTitle: "Join" });
}
export const postJoin = async (req, res, next) => {
    const {
        body: { name, email, password, password2 }
    } = req;
    if (password !== password2) {
        console.log("패스워드 불일치");
        res.status(400);
        res.render("join", { pageTitle: "Join" });
    }
    else {
        try {
            const newUser = new User({
                name,
                email
            });
            await User.register(newUser, password);
            next();
        }
        catch (error) {
            console.log(error);
            res.redirect(routes.home);
        }
    }
}
export const getLogin = (req, res) => res.render("login", { pageTitle: "Login" });
export const postLogin = passport.authenticate('local', {
    successRedirect: routes.home,
    failureRedirect: routes.login
})
export const githubLogin = passport.authenticate('github');
export const githubLoginCallback = async (_, __, profile, cb) => {
    const { _json: { id, avatar_url, name, email } } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.githubId = id;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            email,
            name,
            githubId: id,
            avatarUrl: avatar_url
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};
export const kakaoLogin = passport.authenticate('kakao');
export const kakaoLoginCallback = async (_, __, profile, cb) => {
    const {
        _json: { id, properties: { nickname }, kakao_account: { profile: { profile_image_url }, email } }
    } = profile;
    try {
        const user = await User.findOne({ email });
        if (user) {
            user.kakaoId = id;
            user.save();
            return cb(null, user);
        }
        const newUser = await User.create({
            name: nickname,
            email,
            avatarUrl: profile_image_url,
            kakaoId: id
        });
        return cb(null, newUser);
    } catch (error) {
        return cb(error);
    }
};
export const postGithubLogin = (req, res) => {
    res.redirect(routes.home);
}
export const postKakaoLogin = (req, res) => {
    res.redirect(routes.home);
}
export const logout = (req, res) => {
    req.logout(function (err) {
        if (err) { return next(err); }
        res.redirect('/');
    });
}
export const getMe = async (req, res) => {
    try {
        // To display videos that user has uploaded
        const me = await User.findById(req.user._id).populate('videos');
        res.render("userDetail", { pageTitle: "User Detail", user: me });
    }
    catch {
        console.log(error);
        res.redirect(routes.home);
    }
}
export const userDetail = async (req, res) => {
    const {
        params: { id }
    } = req;
    try {
        const foundUser = await User.findById(id).populate('videos');
        res.render("userDetail", { pageTitle: "User Detail", user: foundUser });
    } catch (error) {
        console.log(error);
        res.redirect(routes.home);
    }
};
export const getEditProfile = (req, res) => res.render("editProfile", { pageTitle: "Edit Profile" });
export const postEditProfile = async (req, res) => {
    const {
        body: { name },
        file
    } = req;
    let avatarUrl = file ? file.path : (req.user.avatarUrl || '');
    if (avatarUrl && avatarUrl.length > 0) avatarUrl = !avatarUrl.includes("https://") ? `../${avatarUrl}` : avatarUrl;

    try {
        await User.findByIdAndUpdate(req.user.id, {
            name,
            avatarUrl
        });
        res.redirect(routes.me);
    } catch (error) {
        console.log(error);
        res.redirect(routes.editProfile);
    }
};
export const getChangePassword = (req, res) => res.render("changePassword", { pageTitle: "Change Password" });
export const postChangePassword = async (req, res) => {
    const {
        body: { oldPassword, newPassword, newPassword1 }
    } = req;
    try {
        if (newPassword !== newPassword1) {
            res.status(400);
            res.redirect(`/users${routes.changePassword}`);
            return;
        }
        await req.user.changePassword(oldPassword, newPassword);
        res.redirect(routes.me);
    } catch (error) {
        console.log(error);
        res.status(400);
        res.redirect(`/users${routes.changePassword}`);
    }
};