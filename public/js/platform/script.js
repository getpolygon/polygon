const postButton = document.getElementById("postButton");
const postText = document.getElementById("postTextarea");

// For checking for delete buttons in the document
function checkForDeleteButtons() {
  // Getting all the buttons with class name
  let deletePostButtons = document.querySelectorAll(".submitDeleteForm");
  deletePostButtons.forEach(element => {
    // Delete the post when the button is clicked
    element.addEventListener("click", deletePost);
  });
  // Return deleteButtons
  return deletePostButtons;
};

// For getting specific cookies
function getCookie(name) {
  // Split cookie string and get all individual name=value pairs in an array
  var cookieArr = document.cookie.split(";");

  // Loop through the array elements
  for (var i = 0; i < cookieArr.length; i++) {
    var cookiePair = cookieArr[i].split("=");

    /* Removing whitespace at the beginning of the cookie name
    and compare it with the given string */
    if (name == cookiePair[0].trim()) {
      // Decode the cookie value and return
      return decodeURIComponent(cookiePair[1]);
    }
  }

  // Return null if not found
  return null;
}

// For deleting posts
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
    method: "POST",
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

function fetchPosts() {
  fetch("/api/fetchPosts")
    .then((res) => res.json())
    .then((data) => {
      if (data.length < 1 || data.length == 0) {
        let msg = document.createElement("div");
        msg.innerHTML =
          `
        <h3 id="msg" align="center">Currently there are no posts</h3>
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

          postText.value = "";

          let currentAccountEmail = getCookie("email").toString();
          let currentAccountPassword = getCookie("password").toString();

          fetch(`/api/checkAccount/?email=${currentAccountEmail}&password=${currentAccountPassword}`, {
            method: "POST",
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

function createPost() {
  fetch("/api/createPost", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: `text=${postText.value}`,
  })
    .then(data => data.json())
    .then(data => {
      console.log(data);
      let msg = document.getElementById("msg");
      let text = data.text;
      let author = data.author;
      let postId = data._id;
      let authorId = data.authorId;
      let authorImage = data.authorImage;
      let postDate = data.datefield;
      let postsContainer = document.getElementById("posts");
      let cardContainer = document.createElement("div");

      postText.value = "";

      if (msg) msg.innerHTML = "";

      cardContainer.innerHTML = `
      <div id="${postId}" class="post container shadow rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
        <div class="container-sm" style="text-align: right;">
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

      // Append the card to the top of the div
      postsContainer.prepend(cardContainer);
      checkForDeleteButtons();
    })
    .catch((e) => {
      console.log(e);
    });
}

window.addEventListener("load", () => {
  let loaderContainer = document.createElement("h3");
  let loader = document.createElement("div");
  loaderContainer.id = "loader";
  loaderContainer.setAttribute("align", "center");
  loader.classList.add("loader");
  loaderContainer.prepend(loader);
  document.getElementById("posts").prepend(loaderContainer)
})
window.addEventListener("load", fetchPosts);
postButton.addEventListener("click", createPost);