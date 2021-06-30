import axios from "axios";

const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");
const arrDeleteBtn = document.querySelectorAll('#jsDeleteBtn');

const decreaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML) - 1;
}
const deleteComment = (_comment) => {
    commentList.removeChild(_comment.parentNode);
    decreaseNumber();
}
export const handleClick = async (event) => {
    event.preventDefault();

    const commentId = event.target.name;
    const videoId = window.location.href.split("/videos/")[1];

    const response = await axios({
        url: `/api/${videoId}/comment-delete`,
        method: "POST",
        data: {commentId}
    });
    if(response.status === 200)   deleteComment(event.target);
}
function init(){
    if(arrDeleteBtn != null)    arrDeleteBtn.forEach((btn) => btn.addEventListener('click', handleClick));
}
init();
