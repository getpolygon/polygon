class TextComponent {
  create(postId, authorImage, authorId, author, postDate, text, { readOnly }) {
    if (readOnly == false) {
      return `
            <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-3 pl-3 pb-2 pt-3 bg-white">
                <i style="float: right" postId="${postId}" class="submitDeleteForm fas fa-trash-alt p-1" role="button"></i>
                <div class="d-flex post-account-component-container mb-2">
                 <img
                 src="${authorImage}"
                 alt="profile-photo"
                 class="rounded-circle shadow-sm profile-photo"
                 width= "50"
                 height="50"
                 />
                 <a class="ml-2" href="/user/${authorId}">${author}</a>
                </div>
                <h6 class="pt-2 text-dark align-baseline">
                ${text}
                </h6>
                <span class="text-secondary">${postDate}</span>
                <hr class="solid" />
                <div class="d-flex">
                  <button type="button" class="btn btn-light btn-block border m-1 love-post" postId="${postId}">
                    <i class="fas fa-heart"></i>
                    Love
                  </button>

                  <button type="button" class="btn btn-light btn-block border m-1" data-toggle="modal" data-target="#comments-${postId}">
                    <i class="fas fa-comment-alt"></i>
                    Comment
                  </button>

                  <div class="modal fade" id="comments-${postId}">
                    <div class="modal-dialog modal-dialog-scrollable">
                      <div class="modal-content ">
                        <div class="modal-header">
                          <h5 class="modal-title" id="staticBackdropLabel">Comments</h5>
                          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                          </button>
                        </div>
                        <div class="modal-body comment-section-${postId}"></div>
                        <div class="modal-footer">
                          <input class="form-control" type="text" placeholder="Write a comment..." />
                          <button class="btn btn-info btn-block">
                            Comment
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
            </div>
          `;
    } else {
      return `
      <div id="${postId}" class="post container shadow-sm rounded-lg mt-1 mb-4 pr-3 pl-3 pb-2 pt-3 bg-white">
        <div class="d-flex post-account-component-container mb-2">
          <img
          src="${authorImage}"
          alt="profile-photo"
          class="rounded-circle shadow-sm profile-photo"
          width= "50"
          height="50"
          />
          <a class="ml-2" href="/user/${authorId}">${author}</a>
        </div>
        <h6 class="pt-2 text-dark align-baseline">
          ${text}
        </h6>
        <span class="text-secondary">${postDate}</span>
        <hr class="solid" />
        <div class="d-flex">
          <button type="button" class="btn btn-light btn-block border m-1 love-post">
            <i class="fas fa-heart"></i>
            Love
          </button>

            <button type="button" class="btn btn-light btn-block border m-1" data-toggle="modal" data-target="#comments-${postId}">
              <i class="fas fa-comment-alt"></i>
              Comment
            </button>

            <div class="modal fade" id="comments-${postId}">
              <div class="modal-dialog modal-dialog-scrollable">
                <div class="modal-content ">
                  <div class="modal-header">
                    <h5 class="modal-title" id="staticBackdropLabel">Comments</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body comment-section-${postId}"></div>
                  <div class="modal-footer">
                    <input class="form-control" type="text" placeholder="Write a comment..." />
                    <button class="btn btn-info btn-block">
                      Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
        `;
    }
  }
}

export default TextComponent;
