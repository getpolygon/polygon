class Footer {
  build(postId) {
    return `
      <hr class="solid" />
      <div class="d-flex">
        <button type="button" class="btn btn-light btn-block border m-1 love-post w-100"></button>

        <button type="button" class="btn btn-light btn-block border m-1 w-100" data-bs-toggle="modal" data-bs-target="#comments-${postId}">
          <i class="fas fa-comment-alt"></i>
          Comment
        </button>

        <div class="modal fade" id="comments-${postId}">
          <div class="modal-dialog modal-dialog-scrollable">
            <div class="modal-content ">
              <div class="modal-header text-center">
                <h5 class="modal-title">Comments</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
              </div>
              <div class="modal-body comment-section-${postId}"></div>
              <div class="d-flex p-3 border-top">
                <input class="form-control w-75 me-1" type="text" placeholder="Write a comment..." />
                <button class="btn btn-primary w-25 ms-1">Comment</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      `;
  }
}

export default Footer;
