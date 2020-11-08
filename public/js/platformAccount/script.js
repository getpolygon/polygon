let postButton = document.getElementById("postButton");
let postText = document.getElementById("postTextarea");
let postCount = document.getElementById("postCount");
let addFriendButton = document.getElementById("addFriend");

function checkForDeleteButtons() {
  let deletePostButtons = document.querySelectorAll(".submitDeleteForm");
  deletePostButtons.forEach(element => {
    element.addEventListener("click", deletePost);
  });
  return deletePostButtons;
};

function fetchPosts() {
  fetch(`/api/fetchPosts/?accountId=${document.getElementById("accountId").textContent}`)
    .then((res) => res.json())
    .then((data) => {
      let msg = document.createElement("div");
      if (data.length < 1 || data.length == 0) {
        msg.innerHTML =
          `
        <h3 id="msg" class="pb-5" align="center">This user doesn't have any posts</h3>
        `;
        let postsContainer = document.getElementById("posts");
        postsContainer.prepend(msg);
        postsContainer.removeChild(document.getElementById("loader"));
      }
      else {
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

          fetch(`/api/checkAccount/?email=${currentAccountEmail}&password=${currentAccountPassword}`, {
            method: "PUT",
            headers: { "Content-Type": "application/x-www-form-urlencoded" }
          })
            .then(response => response.json())
            .then(response => {
              if (obj.authorId == response._id) {
                cardContainer.innerHTML =
                  `
                <div id="${postId}" class="post container shadow rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
                  <div class="container-sm " style="text-align: right;">
                    <i postId="${postId}" class="submitDeleteForm fas fa-trash-alt" role="button"></i>
                  </div>
                  <img
                    src="${authorImage}"
                    alt="profile-photo"
                    class="rounded-circle"
                    width= "80"
                    height="80"
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
                msg.innerHTML = "";
                checkForDeleteButtons();
              }
              else {
                cardContainer.innerHTML =
                  `
              <div id="${postId}" class="post container shadow rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
                <img
                  src="${authorImage}"
                  alt="profile-photo"
                  class="rounded-circle"
                  width= "80"
                  height="80"
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
                msg.innerHTML = "";
                checkForDeleteButtons();
              }
              document.getElementById("loader").innerHTML = "";
            })
            .catch(e => {
              console.log(e);
            });

          postsContainer.appendChild(cardContainer);
        });
      }
    })
    .catch((e) => console.log(e));
};

function deletePost() {
  // Getting the whole post div by id
  let post = document.getElementById(this.parentNode.parentNode.id);
  // Getting the postId attribute
  let postId = this.getAttribute("postId");
  // Progress bar at the top of the card
  let deletionIndicator = document.createElement("div");

  deletionIndicator.innerHTML =
    `
  <div id="progress" class="progress" style="position: relative;">
    <div class="progress-bar progress-bar-striped indeterminate  progress-bar-animated bg-danger" style="width: 100%">
  </div>
  `
  post.prepend(deletionIndicator);

  fetch(`/api/deletePost?postId=${postId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(response => response.json())
    .then(_response => {
      post.parentNode.removeChild(post);
      checkForDeleteButtons();
    })
    .catch(e => {
      let el = document.createElement("div");
      el.innerHTML = `
        <div class="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>There was an error!</strong> Try refreshing your page.
          <button type="button" class="close" data-dismiss="alert" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
      `
      document.body.prepend(el);
      console.log(e);
    });
  checkForDeleteButtons();
};

function createPost() {
  fetch("/api/createPost", {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=${postText.value}`,
  })
    .then((res) => res.json())
    .then((data) => {
      let text = data.text;
      let author = data.author;
      let authorId = data.authorId;
      let authorImage = data.authorImage;
      let postDate = data.datefield;
      let postId = data._id;
      let postsContainer = document.getElementById("posts");
      let cardContainer = document.createElement("div");
      postText.value = "";
      cardContainer.innerHTML = `
        <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
        <div class="container-sm " style="text-align: right;">
            <i postId="${postId}" class="fas fa-trash-alt submitDeleteForm" role="button"></i>
        </div>
        <img
          src="${authorImage}"
          alt="profile-photo"
          class="rounded-circle"
          width= "80"
          height="80"
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
      checkForDeleteButtons();
    })
    .catch((e) => {
      console.log(e);
    });
};

function addFriend() {
  let accountToAdd = document.getElementById("accountId").textContent;
  fetch(`/api/addFriend/?addedAccount=${accountToAdd}`, {
    method: "PUT",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(data => data.json())
    .then(data => {
      addFriendButton.innerText = "Pending";
      addFriendButton.innerHTML += `
      <i class="fas fa-user-clock"></i>
      `;
      addFriendButton.setAttribute("disabled", "true")
      console.log(data);
    })
    .catch(e => console.error(e));
}

window.addEventListener("load", () => {
  loader();
  fetchPosts();
  checkForDeleteButtons();
  if (postButton == null) {
    return null
  } else {
    postButton.addEventListener("click", createPost)
  }
});
addFriendButton.addEventListener("click", addFriend);
