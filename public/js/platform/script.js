const postButton = document.getElementById("postButton");
const postText = document.getElementById("postTextarea");

// Function for reading cookies on the client side
function readCookie(name) {
  var nameEQ = name + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

function fetchPosts() {
  fetch("/api/fetchPosts")
    .then((res) => res.json())
    .then((data) => {
      data.forEach((obj) => {
        let text = obj.text;
        let author = obj.author;
        let authorId = obj.authorId;
        let authorImage = obj.authorImage;
        let postDate = obj.datefield;
        let postsContainer = document.getElementById("posts");
        let cardContainer = document.createElement("div");

        postText.value = "";

        cardContainer.innerHTML =
          `
            <div class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
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

        postsContainer.appendChild(cardContainer);
      });
    })
    .catch((e) => console.log(e));
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
      let postsContainer = document.getElementById("posts");
      let cardContainer = document.createElement("div");

      postText.value = "";

      cardContainer.innerHTML = `
      <div class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
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
    })
    .catch((e) => {
      console.log(e);
    });
}

window.addEventListener("load", fetchPosts);
postButton.addEventListener("click", createPost);
