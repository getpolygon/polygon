import ImageComponent from "/components/image-component.mjs";
import VideoComponent from "/components/video-component.mjs";
import ComboComponent from "/components/combo-component.mjs";
import TextComponent from "/components/text-component.mjs";
import Loader from "/components/loader-component.mjs";

var postsContainer = document.getElementById("posts");
var postButton = document.getElementById("postButton");
var postText = document.getElementById("postTextarea");
var addFriendButton = document.getElementById("add_friend");
var accountId = document.getElementById("accountId").textContent;

// For checking for delete buttons in the document
function checkForDeleteButtons() {
  // Getting all the buttons with class name
  let deletePostButtons = document.querySelectorAll(".submitDeleteForm");
  deletePostButtons.forEach((element) => {
    // Delete the post when the button is clicked
    element.addEventListener("click", deletePost);
  });
  // Return deleteButtons
  return deletePostButtons;
}

// For deleting posts
function deletePost() {
  // Getting the postId attribute
  let postId = this.getAttribute("postId");
  // Getting the whole post div by the Id of postId attribute
  let post = document.getElementById(postId);
  // Progress bar at the top of the card
  let deletionIndicator = document.createElement("div");

  deletionIndicator.innerHTML = `
<div id="progress" class="progress" style="position: relative;">
  <div class="progress-bar progress-bar-striped indeterminate  progress-bar-animated bg-danger" style="width: 100%">
</div>
`;
  post.prepend(deletionIndicator);

  fetch(`/api/posts/delete/?post=${postId}`, { method: "DELETE" })
    .then((response) => response.json())
    .then((response) => {
      post.parentNode.removeChild(post);
      checkForDeleteButtons();
    })
    .catch((e) => {
      let el = document.createElement("div");
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
  checkForDeleteButtons();
}

function fetchPosts() {
  fetch(`/api/posts/fetch/?accountId=${accountId}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.length < 1 || data.length == 0) {
        let msg = document.createElement("div");
        msg.innerHTML = `
      <h5 id="msg" align="center">We couldn't find any posts <br /><br /></h5>
      `;
        let postsContainer = document.getElementById("posts");
        postsContainer.prepend(msg);
        postsContainer.removeChild(document.getElementById("loader"));
      } else {
        data.forEach((obj) => {
          let text = obj.text;
          let author = obj.author;
          let authorId = obj.authorId;
          let authorImage = obj.authorImage;
          let postDate = obj.datefield;
          let postId = obj._id;
          let postsContainer = document.getElementById("posts");
          let cardContainer = document.createElement("div");
          let currentAccountEmail = getCookie("email").toString();
          let currentAccountPassword = getCookie("password").toString();

          fetch(
            `/api/accounts/check/?email=${currentAccountEmail}&password=${currentAccountPassword}`,
            { method: "PUT" }
          )
            .then((response) => response.json())
            .then((response) => {
              if (obj.authorId == response._id) {
                if (obj.hasAttachments == true) {
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
                } else {
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
                if (obj.hasAttachments == true) {
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
                  if (
                    obj.attachments.hasAttachedImage == true &&
                    obj.attachments.hasAttachedVideo == true
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
                } else {
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
              postsContainer.appendChild(cardContainer);
              document.getElementById("loader").innerHTML = "";
              checkForDeleteButtons();
            })
            .catch((e) => {
              console.log(e);
            });
        });
      }
    })
    .catch((e) => console.log(e));
}

function createPost() {
  let imageInput = document.getElementById("imageUpload");
  let videoInput = document.getElementById("videoUpload");
  let image = imageInput.files;
  let video = videoInput.files;

  // TEXT POST
  if (image.length == 0 && video.length == 0) {
    // Form
    let formData = new FormData();
    formData.append("text", postText.value);

    // Loader
    let loader = document.createElement("div");
    loader.classList.add("full-loader");
    loader.classList.add("full-loader-default");
    loader.classList.add("is-active");
    document.body.appendChild(loader);

    // q is to specify the type of post that we want
    fetch("/api/posts/create?q=txt", {
      method: "PUT",
      body: formData,
    })
      .then((data) => data.json())
      .then((data) => {
        let msg = document.getElementById("msg");
        let text = data.text;
        let author = data.author;
        let postId = data._id;
        let authorId = data.authorId;
        let authorImage = data.authorImage;
        let postDate = data.datefield;
        let postsContainer = document.getElementById("posts");
        let cardContainer = document.createElement("div");
        if (msg) msg.innerHTML = "";

        cardContainer.innerHTML = new TextComponent().create(
          postId,
          authorImage,
          authorId,
          author,
          postDate,
          text,
          { readOnly: false }
        );

        postText.value = "";
        imageInput.value = "";
        videoInput.value = "";
        document.body.removeChild(loader);
        postsContainer.prepend(cardContainer);
      })
      .catch((e) => {
        console.log(e);
      });
    checkForDeleteButtons();
  }

  // VIDEO, TEXT POST
  if (video[0] && !image[0]) {
    let formData = new FormData();
    formData.append("text", postText.value);
    formData.append("video", video[0]);

    let loader = document.createElement("div");
    loader.classList.add("full-loader");
    loader.classList.add("full-loader-default");
    loader.classList.add("is-active");
    document.body.appendChild(loader);

    fetch("/api/posts/create?q=vid", {
      method: "PUT",
      body: formData,
    })
      .then((data) => data.json())
      .then((data) => {
        let msg = document.getElementById("msg");
        let text = data.text;
        let author = data.author;
        let postId = data._id;
        let authorId = data.authorId;
        let authorImage = data.authorImage;
        let postDate = data.datefield;
        let video = data.attachments.video.attachedVideo;
        let postsContainer = document.getElementById("posts");
        let cardContainer = document.createElement("div");
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

        postText.value = "";
        imageInput.value = "";
        videoInput.value = "";
        document.body.removeChild(loader);
        postsContainer.prepend(cardContainer);
      })
      .catch((e) => {
        console.log(e);
      });
    checkForDeleteButtons();
  }

  // IMAGE,VIDEO,TEXT POST
  if (image[0] && video[0]) {
    let formData = new FormData();
    formData.append("text", postText.value);
    formData.append("video", video[0]);
    formData.append("image", image[0]);

    let loader = document.createElement("div");
    loader.classList.add("full-loader");
    loader.classList.add("full-loader-default");
    loader.classList.add("is-active");
    document.body.appendChild(loader);

    fetch("/api/posts/create?q=imgvid", {
      method: "PUT",
      body: formData,
    })
      .then((data) => data.json())
      .then((data) => {
        let msg = document.getElementById("msg");
        let text = data.text;
        let author = data.author;
        let postId = data._id;
        let authorId = data.authorId;
        let authorImage = data.authorImage;
        let postDate = data.datefield;
        let video = data.attachments.video.attachedVideo;
        let image = data.attachments.image.attachedImage;
        let postsContainer = document.getElementById("posts");
        let cardContainer = document.createElement("div");
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

        postText.value = "";
        imageInput.value = "";
        videoInput.value = "";
        document.body.removeChild(loader);
        postsContainer.prepend(cardContainer);
      })
      .catch((e) => {
        console.log(e);
      });
    checkForDeleteButtons();
  }
  // IMAGE,TEXT POST
  if (image[0] && !video[0]) {
    let formData = new FormData();
    formData.append("text", postText.value);
    formData.append("image", image[0]);

    let loader = document.createElement("div");
    loader.classList.add("full-loader");
    loader.classList.add("full-loader-default");
    loader.classList.add("is-active");
    document.body.appendChild(loader);

    fetch("/api/posts/create?q=img", {
      method: "PUT",
      body: formData,
    })
      .then((data) => data.json())
      .then((data) => {
        let msg = document.getElementById("msg");
        let text = data.text;
        let author = data.author;
        let postId = data._id;
        let authorId = data.authorId;
        let authorImage = data.authorImage;
        let postDate = data.datefield;
        let image = data.attachments.image.attachedImage;
        let postsContainer = document.getElementById("posts");
        let cardContainer = document.createElement("div");

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
        document.body.removeChild(loader);
        postsContainer.prepend(cardContainer);
      })
      .catch((e) => {
        console.log(e);
      });
    checkForDeleteButtons();
  }
}

function addFriend() {
  let accountToAdd = document.getElementById("accountId").textContent;
  fetch(`/api/friends/add/?account=${accountToAdd}`, { method: "PUT" })
    .then((data) => data.json())
    .then((data) => {
      addFriendButton.innerText = "Pending";
      addFriendButton.innerHTML += `
        <i class="fas fa-user-clock"></i>
        `;
      addFriendButton.setAttribute("disabled", "true");
      buttonContainer.innerHTML += `
        <br />
        <br />
        <button class="btn btn-danger">Cancel friend request <i class="fas fa-times"></i></button>
      `;
      addFriendButton.setAttribute("disabled", "true");
      console.log(data);
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
        buttonContainer.innerHTML += `
          <br />
          <br />
          <button class="btn btn-info">Accept friend request <i class="fas fa-check"></i></button>
          <button class="btn btn-danger">Decline friend request <i class="fas fa-times"></i></button>
        `;
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
        buttonContainer.innerHTML += `
          <br />
          <br />
          <button class="btn btn-danger">Cancel friend request <i class="fas fa-times"></i></button>
        `;
      } else {
        addFriendButton = addFriendButton;
      }
    });
}

window.addEventListener("load", () => {
  checkFriendship();
  fetchPosts();
  let loader = new Loader({ fullScreen: false });
  postsContainer.prepend(loader);
  checkForDeleteButtons();
  if (postButton == null) {
    return null;
  } else {
    postButton.addEventListener("click", createPost);
  }
});
addFriendButton.addEventListener("click", addFriend);
