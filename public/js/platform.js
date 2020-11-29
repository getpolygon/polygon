import ImageComponent from "/components/image-component.mjs";
import VideoComponent from "/components/video-component.mjs";
import ComboComponent from "/components/combo-component.mjs";
import TextComponent from "/components/text-component.mjs";
import Loader from "/components/loader-component.mjs";

const postButton = document.getElementById("postButton");
const postText = document.getElementById("postTextarea");
const postsContainer = document.getElementById("posts");

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
    .then((_response) => {
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

function fetchPosts() {
  const loader = document.getElementById("loader");
  fetch("/api/posts/fetch")
    .then((res) => res.json())
    .then((data) => {
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
          const postsContainer = document.getElementById("posts");
          const cardContainer = document.createElement("div");
          const currentAccountEmail = getCookie("email").toString();
          const currentAccountPassword = getCookie("password").toString();

          // Checking if the email and password in the cookies match db records
          fetch(
            `/api/accounts/check/?email=${currentAccountEmail}&password=${currentAccountPassword}`,
            { method: "PUT" }
          )
            .then((response) => response.json())
            .then((response) => {
              // Account matches
              if (obj.authorId == response._id) {
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
              }
              // Account doesn't match
              else {
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

              postsContainer.appendChild(cardContainer);
              checkForDeleteButtons();

              // Filling up the comment section
              let commentContainer = document.querySelector(
                `.comment-section-${postId}`
              );
              if (comments.length === 0) {
                commentContainer.innerHTML =
                  "Be the first person to comment on this post";
              } else {
                comments.forEach((comment) => {
                  let el = document.createElement("div");
                  el.innerHTML = `
                  <div class="d-flex post-account-component-container mb-2">
                  <img
                  src="${authorImage}"
                  alt="profile-photo"
                  class="rounded-circle shadow-sm profile-photo"
                  width= "50"
                  height="50"
                  >
                  </img>
                  <a class="ml-2" href="/user/${authorId}">${author}</a>
                 </div>
                 <span>${comment.comment}</span>
                  `;
                  commentContainer.appendChild(el);
                });
              }
            })
            .then(fetchHearts)
            .catch((e) => {
              console.log(e);
            });
        });
      }
      postsContainer.removeChild(loader);
    })
    .catch((e) => console.log(e));
}

function fetchHearts() {
  let hearts = document.querySelectorAll(".love-post");
  hearts.forEach((obj) => {
    obj.addEventListener("click", async () => {
      let req = await fetch(
        `/api/posts/fetch/?postId=${obj.getAttribute("postId")}&heart=true`
      );
      await req.json();
      obj.children[1].innerHTML++;
      obj.setAttribute("disabled", "true");
    });
    fetch(`/api/posts/fetch`)
      .then((response) => response.json())
      .then((response) => {
        console.log(response);
        let hearts = document.createElement("span");
        hearts.classList.add("badge");
        hearts.classList.add("badge-pill");
        hearts.classList.add("badge-danger");
        hearts.innerText = response[0].hearts;
        obj.appendChild(hearts);
      });
  });
}

function createPost() {
  const imageInput = document.getElementById("imageUpload");
  const videoInput = document.getElementById("videoUpload");
  const image = imageInput.files;
  const video = videoInput.files;

  // TEXT POST
  if (image.length === 0 && video.length === 0) {
    // Form
    let formData = new FormData();
    formData.append("text", postText.value);

    // Loader
    let loader = new Loader({ fullScreen: true });
    document.body.appendChild(loader);

    // q is to specify the type of post that we want
    fetch("/api/posts/create?q=txt", {
      method: "PUT",
      body: formData
    })
      .then((data) => data.json())
      .then((data) => {
        const msg = document.getElementById("msg");
        const text = data.text;
        const author = data.author;
        const postId = data._id;
        const authorId = data.authorId;
        const authorImage = data.authorImage;
        const postDate = data.datefield;
        const postsContainer = document.getElementById("posts");
        const cardContainer = document.createElement("div");
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
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // VIDEO, TEXT POST
  if (video[0] && !image[0]) {
    let formData = new FormData();
    formData.append("text", postText.value);
    formData.append("video", video[0]);

    // Loader
    let loader = new Loader({ fullScreen: true });
    document.body.appendChild(loader);

    fetch("/api/posts/create?q=vid", {
      method: "PUT",
      body: formData
    })
      .then((data) => data.json())
      .then((data) => {
        const msg = document.getElementById("msg");
        const text = data.text;
        const author = data.author;
        const postId = data._id;
        const authorId = data.authorId;
        const authorImage = data.authorImage;
        const postDate = data.datefield;
        const video = data.attachments.video.attachedVideo;
        const postsContainer = document.getElementById("posts");
        const cardContainer = document.createElement("div");
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
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  // IMAGE,VIDEO,TEXT POST
  if (image[0] && video[0]) {
    let formData = new FormData();
    formData.append("text", postText.value);
    formData.append("video", video[0]);
    formData.append("image", image[0]);

    // Loader
    let loader = new Loader({ fullScreen: true });
    document.body.appendChild(loader);

    fetch("/api/posts/create?q=imgvid", {
      method: "PUT",
      body: formData
    })
      .then((data) => data.json())
      .then((data) => {
        const msg = document.getElementById("msg");
        const text = data.text;
        const author = data.author;
        const postId = data._id;
        const authorId = data.authorId;
        const authorImage = data.authorImage;
        const postDate = data.datefield;
        const video = data.attachments.video.attachedVideo;
        const image = data.attachments.image.attachedImage;
        const postsContainer = document.getElementById("posts");
        const cardContainer = document.createElement("div");
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
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
  }
  // IMAGE,TEXT POST
  if (image[0] && !video[0]) {
    const formData = new FormData();
    formData.append("text", postText.value);
    formData.append("image", image[0]);

    // Loader
    const loader = new Loader({ fullScreen: true });
    document.body.appendChild(loader);

    fetch("/api/posts/create?q=img", {
      method: "PUT",
      body: formData
    })
      .then((data) => data.json())
      .then((data) => {
        const msg = document.getElementById("msg");
        const text = data.text;
        const author = data.author;
        const postId = data._id;
        const authorId = data.authorId;
        const authorImage = data.authorImage;
        const postDate = data.datefield;
        const image = data.attachments.image.attachedImage;
        const postsContainer = document.getElementById("posts");
        const cardContainer = document.createElement("div");

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
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
  }

  postText.value = null;
  postText.nodeValue = null;
  postText.textContent = null;
}

window.addEventListener("load", () => {
  let loader = new Loader({ fullScreen: false });
  postsContainer.prepend(loader);
  fetchPosts();
});
postButton.addEventListener("click", createPost);
