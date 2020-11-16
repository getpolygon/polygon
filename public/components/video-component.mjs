class VideoComponent {
  create(
    postId,
    authorImage,
    authorId,
    author,
    text,
    video,
    postDate,
    { readOnly }
  ) {
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
    } else {
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
    }
  }
}

export default VideoComponent;
