let postButton = document.getElementById("postButton");
let postText = document.getElementById("postTextarea");
let postCount = document.getElementById("postCount");
let addFriendButton = document.getElementById("addFriend");
let accountId = document.getElementById("accountId").textContent;

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
  // Getting the whole post div by id
  let post = document.getElementById(this.parentNode.id);
  // Getting the postId attribute
  let postId = this.getAttribute("postId");
  // Progress bar at the top of the card
  let deletionIndicator = document.createElement("div");

  deletionIndicator.innerHTML = `
  <div id="progress" class="progress" style="position: relative;">
    <div class="progress-bar progress-bar-striped indeterminate  progress-bar-animated bg-danger" style="width: 100%">
  </div>
  `;
  post.prepend(deletionIndicator);

  fetch(`/api/posts/delete?post=${postId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((_response) => {
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
          let image = obj.attachedImage;
          let postsContainer = document.getElementById("posts");
          let cardContainer = document.createElement("div");
          let currentAccountEmail = getCookie("email").toString();
          let currentAccountPassword = getCookie("password").toString();

          fetch(
            `/api/accounts/check/?email=${currentAccountEmail}&password=${currentAccountPassword}`,
            {
              method: "PUT",
            }
          )
            .then((response) => response.json())
            .then((response) => {
              if (obj.authorId == response._id) {
                if (image) {
                  cardContainer.innerHTML = `
                <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
                  <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt" role="button"></i>
                  <img
                    src="${authorImage}"
                    alt="profile-photo"
                    class="rounded-circle"
                    width= "50"
                    height="50"
                  />
                  <h5 class="text-dark mt-3 align-baseline">
                    <a href="/user/${authorId}">${author}</a>
                  </h5>
                  <h6 class="text-dark align-baseline">
                    ${text}
                  </h6>
                  <div class="container p-2">
                    <img src="${image}" width="500" alt="image" />
                  </div>
                  <h6 class="text-secondary">${postDate}</h6>
              </div>
              `;
                } else {
                  cardContainer.innerHTML = `
                <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
                  <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt" role="button"></i>
                  <img
                    src="${authorImage}"
                    alt="profile-photo"
                    class="rounded-circle"
                    width= "50"
                    height="50"
                  />
                  <h5 class="text-dark mt-3 align-baseline">
                    <a href="/user/${authorId}">${author}</a>
                  </h5>
                  <h6 class="text-dark align-baseline">
                    ${text}
                  </h6>
                  <h6 class="text-secondary">${postDate}</h6>
              </div>
              `;
                }
                checkForDeleteButtons();
              } else {
                if (image) {
                  cardContainer.innerHTML = `
              <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
                <img
                  src="${authorImage}"
                  alt="profile-photo"
                  class="rounded-circle"
                  width= "50"
                  height="50"
                />
                <h5 class="text-dark mt-3 align-baseline">
                  <a href="/user/${authorId}">${author}</a>
                </h5>
                <h6 class="text-dark align-baseline">
                  ${text}
                </h6>
                <div class="container p-2">
                <img src="${image}" width="500" alt="image" />
                  </div>
                <h6 class="text-secondary">${postDate}</h6>
            </div>
          `;
                } else {
                  cardContainer.innerHTML = `
            <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
              <img
                src="${authorImage}"
                alt="profile-photo"
                class="rounded-circle"
                width= "50"
                height="50"
              />
              <h5 class="text-dark mt-3 align-baseline">
                <a href="/user/${authorId}">${author}</a>
              </h5>
              <h6 class="text-dark align-baseline">
                ${text}
              </h6>
              <h6 class="text-secondary">${postDate}</h6>
          </div>
        `;
                }

                checkForDeleteButtons();
              }
              document.getElementById("loader").innerHTML = "";
            })
            .catch((e) => {
              console.log(e);
            });

          postsContainer.prepend(cardContainer);
        });
      }
    })
    .catch((e) => console.log(e));
}

function createPost() {
  let imageInput = document.getElementById("imageUpload");
  let image = imageInput.files[0];

  if (image == null) {
    let formData = new FormData();
    formData.append("text", postText.value);

    let loader = document.createElement("div");
    loader.classList.add("full-loader");
    loader.classList.add("full-loader-default");
    loader.classList.add("is-active");
    document.body.appendChild(loader);

    fetch("/api/posts/create", {
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
        postText.value = "";
        cardContainer.innerHTML = `
        <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
          <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt p-2" role="button"></i>
          <img
            src="${authorImage}"
            alt="profile-photo"
            class="rounded-circle"
            width= "50"
            height="50"
          />
          <h4 class="text-dark mt-3 align-baseline">
            <a href="/user/${authorId}">${author}</a>
          </h4>
          <h6 class="text-dark align-baseline">
            ${text}
          </h6>
          <h6 class="text-secondary">${postDate}</h6>
        </div>
      `;
        // Append the card to the top of the div
        postsContainer.prepend(cardContainer);
        document.body.removeChild(loader);
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
  } else {
    let formData = new FormData();
    formData.append("text", postText.value);
    formData.append("image", image);

    let loader = document.createElement("div");
    loader.classList.add("full-loader");
    loader.classList.add("full-loader-default");
    loader.classList.add("is-active");
    document.body.appendChild(loader);

    fetch("/api/posts/create", {
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
        let image = data.attachedImage;
        let postsContainer = document.getElementById("posts");
        let cardContainer = document.createElement("div");

        postText.value = "";

        if (msg) msg.innerHTML = "";

        cardContainer.innerHTML = `
        <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
          <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt p-2" role="button"></i>
          <img
            src="${authorImage}"
            alt="profile-photo"
            class="rounded-circle"
            width= "50"
            height="50"
          />
          <h4 class="text-dark mt-3 align-baseline">
            <a href="/user/${authorId}">${author}</a>
          </h4>
          <h6 class="text-dark align-baseline">
            ${text}
          </h6>
          <div class="container p-2">
            <img src="${image}" width="500" alt="image" />
          </div>
          <h6 class="text-secondary">${postDate}</h6>
        </div>
        `;

        imageInput = "";
        postsContainer.prepend(cardContainer);
        document.body.removeChild(loader);
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
  }
}

function addFriend() {
  let accountToAdd = document.getElementById("accountId").textContent;
  fetch(`/api/friends/add/?addedAccount=${accountToAdd}`, {
    method: "PUT",
  })
    .then((data) => data.json())
    .then((data) => {
      addFriendButton.innerText = "Pending";
      addFriendButton.innerHTML += `
      <i class="fas fa-user-clock"></i>
      `;
      addFriendButton.setAttribute("disabled", "true");
      console.log(data);
    })
    .catch((e) => console.error(e));
}

async function checkFriendship() {
  let accountToCheck = document.getElementById("accountId").textContent;
  let data = await fetch(`/api/friends/check/?accountId=${accountToCheck}`);
  if (data.length != 0) {
    addFriendButton.innerText = "Pending";
    addFriendButton.innerHTML += `
        <i class="fas fa-user-clock"></i>
        `;
    addFriendButton.setAttribute("disabled", "true");
  } else {
    addFriendButton = addFriendButton;
  }
}

window.addEventListener("load", () => {
  checkFriendship();
  loader();
  fetchPosts();
  checkForDeleteButtons();
  if (postButton == null) {
    return null;
  } else {
    postButton.addEventListener("click", createPost);
  }
});
addFriendButton.addEventListener("click", addFriend);
