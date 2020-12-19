import ImageComponent from "/components/image-component.mjs";
import VideoComponent from "/components/video-component.mjs";
import ComboComponent from "/components/combo-component.mjs";
import TextComponent from "/components/text-component.mjs";
import Loader from "/components/loader-component.mjs";
import HeartButtonContent from "/components/partials/HeartButtonContent.mjs";

const postsContainer = document.getElementById("posts");
const postButton = document.getElementById("postButton");
const postText = document.getElementById("postTextarea");
const addFriendButton = document.getElementById("add_friend");
const accountId = document.getElementById("accountId").textContent;

// Funcion for fetching and setting heart count
function FetchHearts(cardContainer) {
  /* ______________FETCH HEARTS_________________________________ */
  // Adding an event listener on all heart buttons
  let loveButtons = cardContainer.querySelectorAll(".love-post");
  loveButtons.forEach(async (button) => {
    button.addEventListener("click", async () => {
      let request_heart = await fetch(
        `/api/posts/fetch/?postId=${button.parentElement.parentElement.id}&heart=true`
      );
      let response_heart = await request_heart.json();
      if (response_heart.info === "HEARTED") {
        button.innerHTML = new HeartButtonContent().build(
          "Unheart",
          response_heart.data.numberOfHearts,
          true
        );
      } else {
        button.innerHTML = new HeartButtonContent().build(
          "Heart",
          response_heart.data.numberOfHearts,
          false
        );
      }
    });

    let request_get_hearts = await fetch(
      `/api/posts/fetch/?postId=${button.parentElement.parentElement.id}&getHearts=true`
    );
    let response_get_hearts = await request_get_hearts.json();
    if (response_get_hearts.info === "ALREADY_HEARTED") {
      button.innerHTML = new HeartButtonContent().build(
        "Unheart",
        response_get_hearts.data.numberOfHearts,
        true
      );
    }
    if (response_get_hearts.info === "OK") {
      button.innerHTML = new HeartButtonContent().build(
        "Heart",
        response_get_hearts.data.numberOfHearts,
        false
      );
    }
  });

  /* ______________FETCH HEARTS END_________________________________ */
}

function checkForDeleteButtons() {
  const deletePostButtons = document.querySelectorAll(".submitDeleteForm");
  deletePostButtons.forEach((element) => {
    element.addEventListener("click", deletePost);
  });
  return deletePostButtons;
}

function deletePost() {
  const postId = this.getAttribute("postId");
  const post = document.getElementById(postId);

  fetch(`/api/posts/delete/?post=${postId}`, { method: "DELETE" })
    .then((response) => response.json())
    .then(() => {
      post.parentNode.removeChild(post);
      checkForDeleteButtons();
      if (postsContainer.innerText.length == 0) {
        const msg = document.createElement("div");
        msg.innerHTML = `<h5 id="msg" align="center">We couldn't find any posts</h5>`;
        postsContainer.prepend(msg);
      }
    })
    .catch((e) => {
      const el = document.createElement("div");
      el.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>There was an error!</strong> Try refreshing your page.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `;
      document.body.prepend(el);
      console.log(e);
    });
}

async function fetchPosts() {
  const request = await fetch("/api/posts/fetch");
  const data = await request.json();

  if (data.length == 0) {
    const msg = document.createElement("div");
    msg.innerHTML = `<h5 id="msg" align="center">We couldn't find any posts</h5>`;
    postsContainer.prepend(msg);
  } else {
    data.forEach((obj) => {
      const text = obj.text;
      const author = obj.author;
      const authorId = obj.authorId;
      const authorImage = obj.authorImage;
      const postDate = obj.datefield;
      const postId = obj._id;
      const comments = obj.comments;
      const isCurrentAccount = obj.isCurrentAccount;
      const postsContainer = document.getElementById("posts");
      const cardContainer = document.createElement("div");

      if (isCurrentAccount) {
        // Post has attachments
        if (obj.hasAttachments == true) {
          // Post has attached image
          if (obj.attachments.hasAttachedImage == true) {
            cardContainer.innerHTML = new ImageComponent().create(
              postId,
              authorImage,
              authorId,
              author,
              text,
              obj.attachments.image.attachedImage,
              postDate,
              { readOnly: false }
            );
          }
          // Post has attached video
          if (obj.attachments.hasAttachedVideo == true) {
            cardContainer.innerHTML = new VideoComponent().create(
              postId,
              authorImage,
              authorId,
              author,
              text,
              obj.attachments.video.attachedVideo,
              postDate,
              { readOnly: false }
            );
          }
          // Post has attached video and image
          if (
            obj.attachments.hasAttachedVideo == true &&
            obj.attachments.hasAttachedImage == true
          ) {
            cardContainer.innerHTML = new ComboComponent().create(
              postId,
              authorImage,
              authorId,
              author,
              postDate,
              text,
              obj.attachments.image.attachedImage,
              obj.attachments.video.attachedVideo,
              { readOnly: false }
            );
          }
        }
        // Post doesn't have attachments
        else {
          cardContainer.innerHTML = new TextComponent().create(
            postId,
            authorImage,
            authorId,
            author,
            postDate,
            text,
            { readOnly: false }
          );
        }
      } else {
        // Post has attachments
        if (obj.hasAttachments == true) {
          // Post has attached image
          if (obj.attachments.hasAttachedImage == true) {
            cardContainer.innerHTML = new ImageComponent().create(
              postId,
              authorImage,
              authorId,
              author,
              text,
              obj.attachments.image.attachedImage,
              postDate,
              { readOnly: true }
            );
          }
          // Post has attached video
          if (obj.attachments.hasAttachedVideo == true) {
            cardContainer.innerHTML = new VideoComponent().create(
              postId,
              authorImage,
              authorId,
              author,
              text,
              obj.attachments.video.attachedVideo,
              postDate,
              { readOnly: true }
            );
          }
          // Post has attached video and image
          if (
            obj.attachments.hasAttachedVideo == true &&
            obj.attachments.hasAttachedImage == true
          ) {
            cardContainer.innerHTML = new ComboComponent().create(
              postId,
              authorImage,
              authorId,
              author,
              postDate,
              text,
              obj.attachments.image.attachedImage,
              obj.attachments.video.attachedVideo,
              { readOnly: true }
            );
          }
        }
        // Post doesn't have attachments
        else {
          cardContainer.innerHTML = new TextComponent().create(
            postId,
            authorImage,
            authorId,
            author,
            postDate,
            text,
            { readOnly: true }
          );
        }
      }

      // Filling up the comment section
      const commentContainer = cardContainer.querySelector(`.comment-section-${postId}`);
      if (comments.length === 0) {
        commentContainer.innerText = "Be the first person to comment on this post";
      } else {
        comments.forEach((comment) => {
          const el = document.createElement("div");
          el.innerHTML = `
            <div class="d-flex post-account-component-container mb-2">
              <img
              src="${authorImage}"
              alt="profile-photo"
              class="rounded-circle shadow-sm profile-photo"
              width= "50"
              height="50"/>
              <a class="ms-2" href="/user/${authorId}">${author}</a>
            </div>
            <span>${comment.comment}</span>
            `;
          commentContainer.appendChild(el);
        });
      }
      FetchHearts(cardContainer);
      postsContainer.appendChild(cardContainer);
      checkForDeleteButtons();
    });
  }
}

async function createPost() {
  const imageInput = document.getElementById("imageUpload");
  const videoInput = document.getElementById("videoUpload");
  const cardContainer = document.createElement("div");
  const imageFiles = imageInput.files;
  const videoFiles = videoInput.files;
  const loader = new Loader({ fullScreen: true });

  document.body.appendChild(loader);

  // TEXT POST
  if (imageFiles.length === 0 && videoFiles.length === 0) {
    let form = new FormData();
    form.append("text", postText.value);
    // "type" is to specify the type of post that we want
    let req = await fetch("/api/posts/create?type=txt", {
      method: "PUT",
      body: form
    });
    let data = await req.json();

    let msg = document.getElementById("msg");
    let text = data.text;
    let author = data.author;
    let postId = data._id;
    let authorId = data.authorId;
    let authorImage = data.authorImage;
    let postDate = data.datefield;

    // Removing the message on the feed
    if (msg) msg.innerHTML = "";

    // Setting the HTML of the Card
    cardContainer.innerHTML = new TextComponent().create(
      postId,
      authorImage,
      authorId,
      author,
      postDate,
      text,
      { readOnly: false }
    );

    // Creating a heart button for the post
    let loveButton = cardContainer.querySelector(".love-post");
    loveButton.innerHTML = new HeartButtonContent().build(
      "Heart",
      data.hearts.numberOfHearts || 0,
      false
    );
  }

  // VIDEO, TEXT POST
  if (videoFiles[0] && !imageFiles[0]) {
    let form = new FormData();
    form.append("text", postText.value);
    form.append("video", videoFiles[0]);

    let req = await fetch("/api/posts/create?type=vid", {
      method: "PUT",
      body: form
    });
    let data = await req.json();

    let msg = document.getElementById("msg");
    let text = data.text;
    let author = data.author;
    let postId = data._id;
    let authorId = data.authorId;
    let authorImage = data.authorImage;
    let postDate = data.datefield;
    let video = data.attachments.video.attachedVideo;

    if (msg) msg.innerHTML = "";

    cardContainer.innerHTML = new VideoComponent().create(
      postId,
      authorImage,
      authorId,
      author,
      text,
      video,
      postDate,
      { readOnly: false }
    );

    let loveButton = cardContainer.querySelector(".love-post");
    loveButton.innerHTML = new HeartButtonContent().build(
      "Heart",
      data.hearts.numberOfHearts,
      false
    );
  }

  // IMAGE,VIDEO,TEXT POST
  if (imageFiles[0] && videoFiles[0]) {
    let form = new FormData();
    form.append("text", postText.value);
    form.append("video", videoFiles[0]);
    form.append("image", imageFiles[0]);

    let req = await fetch("/api/posts/create?type=imgvid", {
      method: "PUT",
      body: form
    });
    let data = await req.json();

    let msg = document.getElementById("msg");
    let text = data.text;
    let author = data.author;
    let postId = data._id;
    let authorId = data.authorId;
    let authorImage = data.authorImage;
    let postDate = data.datefield;
    let video = data.attachments.video.attachedVideo;
    let image = data.attachments.image.attachedImage;

    if (msg) msg.innerHTML = "";

    cardContainer.innerHTML = new ComboComponent().create(
      postId,
      authorImage,
      authorId,
      author,
      postDate,
      text,
      image,
      video,
      { readOnly: false }
    );

    let loveButton = cardContainer.querySelector(".love-post");
    loveButton.innerHTML = new HeartButtonContent().build(
      "Heart",
      data.hearts.numberOfHearts,
      false
    );
  }
  // IMAGE,TEXT POST
  if (imageFiles[0] && !videoFiles[0]) {
    let form = new FormData();
    form.append("text", postText.value);
    form.append("image", imageFiles[0]);

    let req = await fetch("/api/posts/create?type=img", {
      method: "PUT",
      body: form
    });
    let data = await req.json();

    let msg = document.getElementById("msg");
    let text = data.text;
    let author = data.author;
    let postId = data._id;
    let authorId = data.authorId;
    let authorImage = data.authorImage;
    let postDate = data.datefield;
    let image = data.attachments.image.attachedImage;

    if (msg) msg.innerHTML = "";

    cardContainer.innerHTML = new ImageComponent().create(
      postId,
      authorImage,
      authorId,
      author,
      text,
      image,
      postDate,
      { readOnly: false }
    );

    postText.value = "";
    imageInput.value = "";
    videoInput.value = "";
    let loveButton = cardContainer.querySelector(".love-post");
    loveButton.innerHTML = new HeartButtonContent().build(
      "Heart",
      data.hearts.numberOfHearts,
      false
    );
  }

  // Default
  postText.value = "";
  imageInput.value = "";
  videoInput.value = "";
  document.body.removeChild(loader);

  // Fetching Hearts
  FetchHearts(cardContainer);
  // Adding the post to user's feed
  postsContainer.prepend(cardContainer);
  // Checking for delete buttons
  checkForDeleteButtons();
}

function addFriend() {
  const buttonContainer = document.querySelector(".buttons");
  let accountToAdd = document.getElementById("accountId").textContent;
  fetch(`/api/friends/add/?account=${accountToAdd}`, { method: "PUT" })
    .then((data) => data.json())
    .then(() => {
      addFriendButton.innerText = "Pending";
      addFriendButton.innerHTML += `
        <i class="fas fa-user-clock"></i>
        `;
      addFriendButton.setAttribute("disabled", "true");
      if (buttonContainer) {
        buttonContainer.innerHTML += `
        <br />
        <br />
        <button class="btn btn-danger" id="cancel-friend-request">Cancel friend request <i class="fas fa-times"></i></button>
      `;
      }
      addFriendButton.setAttribute("disabled", "true");
    })
    .catch((e) => console.error(e));
}

function checkFriendship() {
  var buttonContainer = document.querySelector(".buttons");
  fetch(`/api/friends/check/?accountId=${accountId}`)
    .then((data) => data.json())
    .then((data) => {
      if (data.pending) {
        addFriendButton.innerText = "Sent you a friend request";
        addFriendButton.innerHTML += `
            <i class="fas fa-user-clock"></i>
            `;
        if (buttonContainer) {
          buttonContainer.innerHTML += `
          <br />
          <br />
          <button class="btn btn-info">Accept friend request <i class="fas fa-check"></i></button>
          <button class="btn btn-danger">Decline friend request <i class="fas fa-times"></i></button>
        `;
        }
      }
      if (data.approved) {
        addFriendButton.innerText = "Friends";
        addFriendButton.innerHTML += `
          <i class="fas fa-user-check"></i>
          `;
      }
      if (data.requested) {
        addFriendButton.innerText = "Pending";
        addFriendButton.innerHTML += `
          <i class="fas fa-user-clock"></i>
          `;
        addFriendButton.setAttribute("disabled", "true");
        if (buttonContainer) {
          buttonContainer.innerHTML += `
          <br />
          <br />
          <button class="btn btn-danger cancel-friend-request">Cancel friend request <i class="fas fa-times"></i></button>
        `;
        }
      }
      if (data.is_current_account === true) {
        addFriendButton.setAttribute("disabled", "true");
      }

      let cancelFriendRequestButton = document.querySelector(".cancel-friend-request");
      if (cancelFriendRequestButton) {
        cancelFriendRequestButton.addEventListener("click", () => {
          fetch(`/api/friends/update/?accountId=${accountId}&cancel=true`, {
            method: "PUT"
          })
            .then((res) => res.json())
            .then((res) => {
              if (buttonContainer) {
                buttonContainer.innerHTML = `
                  <button class="btn btn-success">Add Friend</button>
                `;
              }

              console.log(res);
            })
            .catch((e) => console.error(e));
        });
      }
    })
    .catch((e) => console.error(e));
}

window.addEventListener("load", () => {
  checkFriendship();
  fetchPosts();
  checkForDeleteButtons();
  if (postButton == null) {
    return null;
  } else {
    postButton.addEventListener("click", createPost);
  }
});
addFriendButton.addEventListener("click", addFriend);
