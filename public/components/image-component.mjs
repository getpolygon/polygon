import Footer from "/components/partials/Footer.mjs";

class ImageComponent {
  create(postId, authorImage, authorId, author, text, image, postDate, { readOnly }) {
    function checkReadOnly() {
      if (!readOnly)
        return `<i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt p-2" role="button"></i>`;
      else return "";
    }
    return ` 
      <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-4 pl-4 pb-3 pt-3 bg-white">
        ${checkReadOnly()}

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
          <img
            role="button"
            data-bs-toggle="modal"
            data-bs-target="#image-${postId}-modal"
            class="post-image"
            src="${image}"
            width="500"
            alt="image" 
          />
          <!-- Modal -->
          <div class="modal fade" id="image-${postId}-modal" tabindex="-1" aria-labelledby="image-${postId}-label" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h5 class="modal-title" id="image-${postId}-label">Post by — ${author}</h5>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <img
                    class="post-image"
                    src="${image}"
                    alt="photo"
                    class="rounded-circle"
                  />
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <h6 class="text-secondary">${postDate}</h6>
        ${new Footer().build(postId)}
      </div>       
      `;
  }
}

export default ImageComponent;
