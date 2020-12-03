import Footer from "/components/partials/Footer.mjs";

class ComboComponent {
  create(postId, authorImage, authorId, author, postDate, text, image, video, { readOnly }) {
    if (readOnly == false) {
      return `
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
          <div id="carousel" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
              <video
              class="video-js vjs-theme-city post-video"
              style="margin: 0 auto"
              controls
              preload="auto"
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
                <img src="${image}" class="d-block w-100 post-image" alt="...">
              </div>
            <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
        <h6 class="text-secondary">${postDate}</h6>
        ${new Footer().build(postId)}
      </div>
      `;
    } else {
      return `
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
          <div id="carousel" class="carousel slide" data-ride="carousel">
            <div class="carousel-inner">
              <div class="carousel-item active">
              <video
              class="video-js vjs-theme-city post-video"
              style="margin: 0 auto"
              controls
              preload="auto"
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
                <img src="${image}" class="d-block w-100 post-image" alt="...">
              </div>
            <a class="carousel-control-prev" href="#carousel" role="button" data-slide="prev">
              <span class="carousel-control-prev-icon" aria-hidden="true"></span>
              <span class="sr-only">Previous</span>
            </a>
            <a class="carousel-control-next" href="#carousel" role="button" data-slide="next">
              <span class="carousel-control-next-icon" aria-hidden="true"></span>
              <span class="sr-only">Next</span>
            </a>
          </div>
        </div>
        <h6 class="text-secondary">${postDate}</h6>
        ${new Footer().build(postId)}
      </div>
      `;
    }
  }
}

export default ComboComponent;
