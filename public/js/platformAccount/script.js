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

  fetch(`/api/posts/delete/?post=${postId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
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
  fetch("/api/posts/fetch")
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
            {
              method: "PUT",
              headers: {
                "Content-Type": "application/x-www-form-urlencoded",
              },
            }
          )
            .then((response) => response.json())
            .then((response) => {
              if (obj.authorId == response._id) {
                if (obj.hasAttachments == true) {
                  if (obj.attachments.hasAttachedImage == true) {
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
                        <img src="${obj.attachments.image.attachedImage}" width="500" alt="image" />
                      </div>
                      <h6 class="text-secondary">${postDate}</h6>
                    </div>
                    `;
                  }
                  if (obj.attachments.hasAttachedVideo == true) {
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
                        <video
                        class="video-js vjs-theme-city"
                        
                        controls
                        preload="auto"
                        width= "500"
                        height="500"
                        
                        data-setup="{}"
                      >
                        <source src="${obj.attachments.video.attachedVideo}"/>
                        <p class="vjs-no-js">
                          To view this video please enable JavaScript, and consider upgrading to a
                          web browser that
                          <a href="https://videojs.com/html5-video-support/" target="_blank"
                            >supports HTML5 video</a
                          >
                        </p>
                      </video>
                      </div>
                      <h6 class="text-secondary">${postDate}</h6>
                    </div>
                    `;
                  }
                  if (
                    obj.attachments.hasAttachedVideo == true &&
                    obj.attachments.hasAttachedImage == true
                  ) {
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
                        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                          <div class="carousel-inner">
                            <div class="carousel-item active">
                            <video
                            class="video-js vjs-theme-city"
                            
                            controls
                            preload="auto"
                            width="500"
                            height="500"
                            
                            data-setup="{}"
                          >
                            <source src="${obj.attachments.video.attachedVideo}"/>
                            <p class="vjs-no-js">
                              To view this video please enable JavaScript, and consider upgrading to a
                              web browser that
                              <a href="https://videojs.com/html5-video-support/" target="_blank"
                                >supports HTML5 video</a
                              >
                            </p>
                          </video>
                              
                            </div>
                            <div class="carousel-item">
                              <img src="${obj.attachments.image.attachedImage}" class="d-block w-100" alt="...">
                            </div>
                          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                          </a>
                          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                          </a>
                        </div>
                      </div>
                      <h6 class="text-secondary">${postDate}</h6>
                    </div>
                    `;
                  }
                } else {
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
                }
              } else {
                if (obj.hasAttachments == true) {
                  if (obj.attachments.hasAttachedImage == true) {
                    cardContainer.innerHTML = `
                    <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
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
                        <img src="${obj.attachments.image.attachedImage}" width="500" alt="image" />
                      </div>
                      <h6 class="text-secondary">${postDate}</h6>
                    </div>
                    `;
                  }
                  if (obj.attachments.hasAttachedVideo == true) {
                    cardContainer.innerHTML = `
                    <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
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
                      <video
                      class="video-js vjs-theme-city"
                      
                      controls
                      preload="auto"
                      width="500"
                      height="500"
                      
                      data-setup="{}"
                    >
                      <source src="${obj.attachments.video.attachedVideo}"/>
                      <p class="vjs-no-js">
                        To view this video please enable JavaScript, and consider upgrading to a
                        web browser that
                        <a href="https://videojs.com/html5-video-support/" target="_blank"
                          >supports HTML5 video</a
                        >
                      </p>
                    </video>
                      </div>
                      <h6 class="text-secondary">${postDate}</h6>
                    </div>
                    `;
                  }
                  if (
                    obj.attachments.hasAttachedImage == true &&
                    obj.attachments.hasAttachedVideo == true
                  ) {
                    cardContainer.innerHTML = `
                    <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
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
                        <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                          <div class="carousel-inner">
                            <div class="carousel-item active">
                            <video
                            class="video-js vjs-theme-city"
                            
                            controls
                            preload="auto"
                            width="500"
                            height="500"
                            
                            data-setup="{}"
                          >
                            <source src="${obj.attachments.video.attachedVideo}"/>
                            <p class="vjs-no-js">
                              To view this video please enable JavaScript, and consider upgrading to a
                              web browser that
                              <a href="https://videojs.com/html5-video-support/" target="_blank"
                                >supports HTML5 video</a
                              >
                            </p>
                          </video>
                            </div>
                            <div class="carousel-item">
                              <img src="${obj.attachments.image.attachedImage}" class="d-block w-100" alt="...">
                            </div>
                          <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span class="sr-only">Previous</span>
                          </a>
                          <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                            <span class="sr-only">Next</span>
                          </a>
                        </div>
                      </div>
                      <h6 class="text-secondary">${postDate}</h6>
                    </div>
                    `;
                  }
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
                  <h4 class="text-dark mt-3 align-baseline">
                    <a href="/user/${authorId}">${author}</a>
                  </h4>
                  <h6 class="text-dark align-baseline">
                    ${text}
                  </h6>
                  <h6 class="text-secondary">${postDate}</h6>
                </div>
                  `;
                }
              }
              checkForDeleteButtons();
              postText.value = "";
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
        imageInput = null;
        videoInput = null;
        postText.value = "";
        checkForDeleteButtons();
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
        <video
        class="video-js vjs-theme-city"
        
        controls
        preload="auto"
        width="500"
        height="500"
        
        data-setup="{}"
      >
        <source src="${video}"/>
        <p class="vjs-no-js">
          To view this video please enable JavaScript, and consider upgrading to a
          web browser that
          <a href="https://videojs.com/html5-video-support/" target="_blank"
            >supports HTML5 video</a
          >
        </p>
      </video>
        </div>
        <h6 class="text-secondary">${postDate}</h6>
      </div>
      `;
        postsContainer.prepend(cardContainer);
        document.body.removeChild(loader);
        imageInput = null;
        videoInput = null;
        postText.value = "";
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
              <div id="carouselExampleControls" class="carousel slide" data-ride="carousel">
                <div class="carousel-inner">
                  <div class="carousel-item active">
                  <video
                  class="video-js vjs-theme-city"
                  
                  style="margin: 0 auto"
                  controls
                  preload="auto"
                  width="500"
                  height="500"
                  
                  data-setup="{}"
                >
                  <source src="${video}"/>
                  <p class="vjs-no-js">
                    To view this video please enable JavaScript, and consider upgrading to a
                    web browser that
                    <a href="https://videojs.com/html5-video-support/" target="_blank"
                      >supports HTML5 video</a
                    >
                  </p>
                </video>
                  </div>
                  <div class="carousel-item">
                    <img src="${image}" class="d-block w-100" alt="...">
                  </div>
                <a class="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                  <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                  <span class="sr-only">Previous</span>
                </a>
                <a class="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                  <span class="carousel-control-next-icon" aria-hidden="true"></span>
                  <span class="sr-only">Next</span>
                </a>
              </div>
            </div>
            <h6 class="text-secondary">${postDate}</h6>
          </div>
        `;

        postsContainer.prepend(cardContainer);
        document.body.removeChild(loader);
        imageInput = null;
        videoInput = null;
        postText.value = "";
        checkForDeleteButtons();
      })
      .catch((e) => {
        console.log(e);
      });
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

        postsContainer.prepend(cardContainer);
        document.body.removeChild(loader);
        imageInput = null;
        videoInput = null;
        postText.value = "";
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

function checkFriendship() {
  fetch(`/api/friends/check/?accountId=${accountId}`)
    .then((data) => data.json())
    .then((data) => {
      if (data.length != 0) {
        addFriendButton.innerText = "Pending";
        addFriendButton.innerHTML += `
          <i class="fas fa-user-clock"></i>
          `;
        addFriendButton.setAttribute("disabled", "true");
      } else {
        addFriendButton = addFriendButton;
      }
    });
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
