import axios from "axios";
import {handleClick} from "./deleteComment"

const addCommentForm = document.getElementById("jsAddComment");
const commentList = document.getElementById("jsCommentList");
const commentNumber = document.getElementById("jsCommentNumber");

const increaseNumber = () => {
    commentNumber.innerHTML = parseInt(commentNumber.innerHTML) + 1;
}

const addComment = (comment, commentId) => {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.innerHTML = comment;
    li.appendChild(span);
    commentList.prepend(li);
    increaseNumber();
    addDeleteButton(li, commentId);
}
const addDeleteButton = (parent, commentId) => {
    const button = document.createElement('button');
    button.id = "jsDeleteBtn";
    button.classList.add('btn__delete-comment');
    button.innerHTML = "❌";
    button.name = commentId;
    button.addEventListener('click', handleClick);
    parent.append(button);
}
const sendComment = async (comment) => {
  const videoId = window.location.href.split("/videos/")[1];
  const response = await axios({
    url: `/api/${videoId}/comment`,
    method: "POST",
    data: {
      comment
    }
  });

  if(response.status === 200)   addComment(comment, response.data["comment-id"]);
};

const handleSubmit = event => {
  event.preventDefault();
  const commentInput = addCommentForm.querySelector("input");
  const comment = commentInput.value;
  sendComment(comment);
  commentInput.value = "";
};

function init() {
  addCommentForm.addEventListener("submit", handleSubmit);
}

if (addCommentForm) {
  init();
}