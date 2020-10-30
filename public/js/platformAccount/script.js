let postButton = document.getElementById("postButton");
let postText = document.getElementById("postTextarea");
let postCount = document.getElementById("postCount");

(function checkForDeleteButtons() {
  let deletePostButtons = document.querySelectorAll(".submitDeleteForm");
  deletePostButtons.forEach(element => {
    element.addEventListener("click", deletePost);
  });
  return deletePostButtons;
})();

function deletePost() {
  let postId = this.getAttribute("postId");
  let el = document.createElement("div");
  fetch(`/api/deletePost?postId=${postId}`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" }
  })
    .then(response => response.json())
    .then(response => {
      el.innerHTML = `
      <div class="alert alert-success alert-dismissible fade show" role="alert">
      <strong>Your post has been deleted</strong>
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>
      </div>`
      document.body.prepend(el);
    })
    .catch(e => {
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
    })
}

function checkPostContainer() {
  let postsContainer = document.getElementById("posts");
  let postMsg = document.getElementById("postCount");
  if (postsContainer.innerText.length < 1) {
    postsContainer.innerHTML = `
    <h5 id="postCount" class="pb-5" align="center">This user doesn't have any posts</h5>
    `
  } else {
    if (postMsg) {
      postMsg.innerText = "";
      postMsg.innerHTML = "";
      postsContainer.removeChild(postMsg);
    }
  }
}

function createPost() {
  fetch("/api/createPost", {
    method: "POST",
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
        <div class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
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
      
      (function checkForDeleteButtons() {
        let deletePostButtons = document.querySelectorAll(".submitDeleteForm");
        deletePostButtons.forEach(element => {
          element.addEventListener("click", deletePost);
        });
        return deletePostButtons;
      })();
    })
    .catch((e) => {
      console.log(e);
    });
};

postButton.addEventListener("click", createPost);
postButton.addEventListener("click", checkPostContainer);
window.addEventListener("load", checkPostContainer);